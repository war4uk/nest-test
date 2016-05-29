import Marionette from 'backbone.marionette';
import thermostatLayout from './thermostat-layout.hbs';

export default class ThermostatLayout extends Marionette.ItemView {
  constructor(...args) {
    super(...args);
    this.template = thermostatLayout;
    this.init();
  }

  init() {
    this.listenTo(this.model, 'change', () => {
      this.render();
    });
  }
}
