const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const NestStrategy = require('passport-nest').Strategy;

/**
  Setup Passport to use the NestStrategy,
  simply pass in the clientID and clientSecret.

  Here we are pulling those in from ENV variables.
*/
passport.use(new NestStrategy(
  {
    clientID: process.env.NEST_ID,
    clientSecret: process.env.NEST_SECRET,
  }
));

/**
  No user data is available in the Nest OAuth
  service, just return the empty user object.
*/
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
  No user data is available in the Nest OAuth
  service, just return the empty user object.
*/
passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
  Setup the Express app
*/
app.use(cookieParser('cookie_secret_shh')); // Change for production apps
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  secret: 'session_secret_shh', // Change for production apps
  resave: true,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

/**
  Server our static jQuery app.
*/
app.use(express.static(`${__dirname}/app`));
app.use('/node_modules', express.static(`${__dirname}/node_modules`));

/**
  Listen for calls and redirect the user to the Nest OAuth
  URL with the correct parameters.
*/
app.get('/auth/nest', passport.authenticate('nest'));

/**
  Upon return from the Nest OAuth endpoint, grab the user's
  accessToken and set a cookie so jQuery can access, then
  return the user back to the root app.
*/
app.get('/auth/nest/callback',
  passport.authenticate('nest', {}),
  (req, res) => {
    res.cookie('nest_token', req.user.accessToken);
    res.redirect('/');
  }
);

/**
  Export the app
*/
module.exports = app;
