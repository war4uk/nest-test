import Marionette from 'backbone.marionette';
import thermostatsLayout from './thermostats-layout.hbs';
import ThermostatLayout from './ThermostatLayout';
import ThermostatStateModel from './ThermostatStateModel';
import Backbone from 'backbone';

export default class ThermostatsLayout extends Marionette.LayoutView {
  constructor(...args) {
    super(...args);
    this.template = thermostatsLayout;
    this.init();
  }

  init() {
    this.addRegions({
      northRegion: '#north',
      westRegion: '#west',
      eastRegion: '#east',
      southRegion: '#south',
    });

    this.northModel = new ThermostatStateModel();
    this.listenTo(this.model, 'change', () => {
      this.render();
      this.showThermostats();
    });
  }

  showThermostats() {
    this.showChildView(
      'northRegion', new ThermostatLayout({ model: new Backbone.Model(this.model.get('north')) })
    );
    this.showChildView(
      'westRegion', new ThermostatLayout({ model: new Backbone.Model(this.model.get('west')) })
    );
    this.showChildView(
      'eastRegion', new ThermostatLayout({ model: new Backbone.Model(this.model.get('east')) })
    );
    this.showChildView(
      'southRegion', new ThermostatLayout({ model: new Backbone.Model(this.model.get('south')) })
    );
  }
}
