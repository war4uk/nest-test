import $ from 'jquery';
import Handlebars from 'hbsfy/runtime';

require('jquery.cookie'); // todo
window.jQuery = $;
require('bootstrap');
Handlebars.registerHelper('tolower', s => s.toLowerCase());
