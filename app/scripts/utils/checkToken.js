import $ from 'jquery';
import * as NestAPIConnector from './NestAPIConnector';

const nestToken = $.cookie('nest_token');

if (nestToken) { // Simple check for token
  // Create a reference to the API using the provided token
  NestAPIConnector.initilialize(nestToken);

  // in a production client we would want to
  // handle auth errors here.
} else {
  // No auth token, go get one
  window.location.replace('/auth/nest');
}
