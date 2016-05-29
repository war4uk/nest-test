require('./utils/startupConfig');
require('./utils/checkToken');
import Marionette from 'backbone.marionette';
import Backbone from 'backbone';
import AppLayout from './AppLayout/AppLayout';
import CitySelectorLayout from './CitySelector/CitySelectorLayout';
import CitySelectorModel from './CitySelector/CitySelectorModel';
import ThermostatLayoutModel from './Thermostats/ThermostatLayoutModel';
import ThermostatsLayout from './Thermostats/ThermostatsLayout';

import WeatherStatusModel from './WeatherStatus/WeatherStatusModel';
import WeatherStatusLayout from './WeatherStatus/WeatherStatusLayout';

import Router from './router';

const App = new Marionette.Application();

App.addInitializer(() => {
  App.rootLayout = new AppLayout({ el: '#demo' });
  App.rootLayout.render();

  App.Router = new Router(App);
  Backbone.history.start();
});

App.on('route:index', configureIndexPage);

App.start();

function configureIndexPage() {
  const startingCity = localStorage.getItem('startingCity') || 'London';
  const citySelectorModel = new CitySelectorModel({ city: startingCity });
  const weatherStatusModel = new WeatherStatusModel({ reqCity: startingCity });

  configureCitySelector(citySelectorModel, weatherStatusModel);
  configureWeatherStatus(weatherStatusModel);

  configureThermostat();
}

function configureCitySelector(citySelectorModel, weatherStatusModel) {
  const citySelectorLayout = new CitySelectorLayout({ model: citySelectorModel });
  App.rootLayout.citySelectorRegion.show(citySelectorLayout);

  citySelectorModel.on('change',
    changedCityModel => {
      const changedCity = changedCityModel.get('city');
      localStorage.setItem('startingCity', changedCity);

      weatherStatusModel.set({ reqCity: changedCity });

      weatherStatusModel.fetch({
        error: () => console.log('error while fetching'),
      });
    }
  );
}

function configureWeatherStatus(weatherStatusModel) {
  weatherStatusModel.fetch();
  const weatherStatusLayout = new WeatherStatusLayout({ model: weatherStatusModel });
  App.rootLayout.weatherStatusRegion.show(weatherStatusLayout);
}

function configureThermostat() {
  const thermostatLayoutModel = new ThermostatLayoutModel();
  const thermostatsLayout = new ThermostatsLayout({ model: thermostatLayoutModel });
  App.rootLayout.thermostatsStatusRegion.show(thermostatsLayout);
}
