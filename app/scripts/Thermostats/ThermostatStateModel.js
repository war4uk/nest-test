import Backbone from 'backbone';

export default class ThermostatStateModel extends Backbone.Model {
  update(model) {
    this.set(model);
    this.trigger('change', this);
  }
}
