import Marionette from 'backbone.marionette';
import * as NestApiConnector from '../utils/NestAPIConnector';
import config from '../config.json';

class WeatherController extends Marionette.Controller {
  applyWeather(windDirection, temp) {
    const idsToSet = getDirectionsToSet(windDirection);
    const idsToTurnOff = Object.values(config.thermostatIds).filter(id => !idsToSet.includes(id));

    let adjustedTemp = Math.round(temp);
    adjustedTemp = Math.min(adjustedTemp, 32);
    adjustedTemp = Math.max(adjustedTemp, 9);
    Promise.all(idsToSet.map(
      id => NestApiConnector.setThermostatTemp(id, adjustedTemp)
    )).catch(() => console.log('error happened'));

    Promise.all(idsToTurnOff.map(
      id => NestApiConnector.turnThermostatOff(id))
    ).catch(() => console.log('error happened'));
  }
}

function getDirectionsToSet(windDirection) {
  // remove duplicates (not very efficient, but probably does not matter here)
  const directions = [...windDirection].filter((item, pos, array) => array.indexOf(item) === pos);
  const [firstDir, secondDir] = directions;
  // if directions are the same use two fans, if not - one
  // as this is meteorological directions maximum two directions and minimum one will exist
  // if one symbol (i.e. N) - then only N taken, if three (i.e. WSW) then first is always taken
  // if two symbols (i.e. NW) - both are taken
  if (windDirection.length === 2) {
    return [mapDirectionToId(firstDir), mapDirectionToId(secondDir)];
  }
  return [mapDirectionToId(firstDir)];
}

function mapDirectionToId(dir) {
  switch (dir.toLowerCase()) {
    case 'n':
      return config.thermostatIds.north;
    case 'e':
      return config.thermostatIds.east;
    case 'w':
      return config.thermostatIds.west;
    case 's':
      return config.thermostatIds.south;
    default:
      throw new Error('Incorrect direction');
  }
}

export default new WeatherController();
