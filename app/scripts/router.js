import Backbone from 'backbone';

export default class Router extends Backbone.Router {
  constructor(app) {
    super();
    this.application = app;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.route('', 'index');
  }

  index() {
    this.application.trigger('route:index');
  }
}
