import Backbone from 'backbone';

export default class WeatherStatusModel extends Backbone.Model {
  get url() {
    // todo config
    return `http://api.openweathermap.org/data/2.5/weather?q=${this.get('reqCity')}&appid=ed9b6ddbd54fb73b4f20c098be341d42&units=metric`;
  }
  parse({ name, wind, main }) {
    if (!name || !wind || !main) {
      console.log('error on updating weather status');
      return {};
    }
    return {
      city: name,
      windSpeed: wind.speed,
      windDirection: getWindDirection(wind.deg),
      temp: main.temp,
    };
  }
}

function getWindDirection(deg) {
  if (!deg) {
    return null;
  }
  if (deg >= 348.75 || deg < 11.25) {
    return 'N'; // handle North separately
  }

  const directionMap = {
    NNE: [11.25, 33.75],
    NE: [33.75, 56.25],
    ENE: [56.25, 78.75],
    E: [78.75, 101.25],
    ESE: [101.25, 123.75],
    SE: [123.75, 146.25],
    SSE: [146.25, 168.75],
    S: [168.75, 191.25],
    SSW: [191.25, 213.75],
    SW: [213.75, 236.25],
    WSW: [236.25, 258.75],
    W: [258.75, 281.25],
    WNW: [281.25, 303.75],
    NW: [303.75, 326.25],
    NNW: [326.25, 348.75],
  };

  return Object.keys(directionMap).find(key => {
    const arr = directionMap[key];
    const lowerBound = arr[0];
    const upperBound = arr[1];

    return lowerBound <= deg && deg < upperBound;
  });
}

