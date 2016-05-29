import { EventEmitter } from 'events';
let fireBaseClient;
let currentThermostats = {};
export const eventEmitter = new EventEmitter();

export function initilialize(nestToken) {
  fireBaseClient = new Firebase('wss://developer-api.nest.com');
  fireBaseClient.auth(nestToken);

  fireBaseClient.on('value', snapshot => {
    currentThermostats = snapshot.val().devices.thermostats;
    eventEmitter.emit('termostats_updated', currentThermostats);
  });
}

export function setThermostatTemp(id, temp) {
  const mode = getModeForThermostat(id, temp);

  return setThermostatMode(id, mode)
    .then(() => setTemperature(id, temp))
    .then(() => setThermostatFanActive(id, true));
}

export function turnThermostatOff(id) {
  return setThermostatMode(id, 'off')
    .then(() => setThermostatFanActive(id, false));
}

function getModeForThermostat(id, temp) {
  const thermostat = currentThermostats[id];
  return thermostat.ambient_temperature_c < temp ? 'heat' : 'cool';
}

function setThermostatMode(id, mode) {
  return new Promise((resolve, reject) => {
    const path = `devices/thermostats/${id}/hvac_mode`;
    fireBaseClient.child(path).set(mode, (err) => {
      if (err) {
        reject();
      }
      resolve();
    });
  });
}

function setTemperature(id, temp) {
  return new Promise((resolve, reject) => {
    const path = `devices/thermostats/${id}/target_temperature_c`;
    fireBaseClient.child(path).set(temp, (err) => {
      if (err) {
        reject();
      }
      resolve();
    });
  });
}

function setThermostatFanActive(id, isOn) {
  return new Promise((resolve, reject) => {
    const path = `devices/thermostats/${id}/fan_timer_active`;
    fireBaseClient.child(path).set(isOn, (err) => {
      if (err) {
        reject();
      }
      resolve();
    });
  });
}
