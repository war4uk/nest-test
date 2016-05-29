import * as NestAPIConnector from '../utils/NestAPIConnector';
import config from '../config.json';
import Backbone from 'backbone';

export default class ThermostatLayoutModel extends Backbone.Model {
  constructor() {
    super();
    this.updateFromAPI(NestAPIConnector.currentThermostats || {});
    NestAPIConnector.eventEmitter
      .on('termostats_updated', thermostats => this.updateFromAPI(thermostats));
  }

  updateFromAPI(thermostats) {
    this.set({
      north: thermostats[config.thermostatIds.north],
      south: thermostats[config.thermostatIds.south],
      east: thermostats[config.thermostatIds.east],
      west: thermostats[config.thermostatIds.west],
    });
    this.trigger('change', this);
  }
}
