import Marionette from 'backbone.marionette';
import layoutTemplate from './layout.hbs';

export default class AppLayout extends Marionette.LayoutView {
  constructor(...args) {
    super(...args);
    this.template = layoutTemplate;
    this.initialize();
  }

  initialize() {
    this.addRegions({
      citySelectorRegion: '#citySelector',
      weatherStatusRegion: '#weatherStatus',
      thermostatsStatusRegion: '#thermostatsStatus',
    });
  }
}
