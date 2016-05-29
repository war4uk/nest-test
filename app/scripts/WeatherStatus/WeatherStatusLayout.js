import Marionette from 'backbone.marionette';
import weatherController from './weatherController';
import weatherStatusTemplate from './weather-status.hbs';

export default class WeatherStatusLayout extends Marionette.ItemView {
  constructor(...args) {
    super(...args);
    this.template = weatherStatusTemplate;
    this.init();
  }

  init() {
    this.events = {
      'click #applyWind': 'applyWind',
    };
    this.delegateEvents();
    this.listenTo(this.model, 'change', this.render);
  }

  applyWind() {
    weatherController.applyWeather(
      this.model.get('windDirection'),
      this.model.get('temp'),
      this.model.get('windSpeed') // seems we cannot get this :(
    );
  }
}
