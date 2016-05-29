import Marionette from 'backbone.marionette';
import citySelectorTemplate from './city-selector.hbs';
import $ from 'jquery';

export default class CitySelectorLayout extends Marionette.ItemView {
  constructor(...args) {
    super(...args);
    this.template = citySelectorTemplate;
    this.init();
  }

  init() {
    this.events = {
      'click #btn_submit': 'cityChanged',
    };
    this.delegateEvents();
    this.listenTo(this.model, 'change', this.render);
  }

  cityChanged() {
    const userInput = $('#city_selector', this.$el).val();
    const city = validateCity(userInput);
    this.model.set({ city });
  }
}

function validateCity(userInput) {
  // todo do actual validation
  return userInput;
}
