var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var router = express.Router(); // get an instance of the express Router
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('', router);
app.use(express.static('public'));
app.use(express.static('public/views'));
app.use(favicon(__dirname + '/public/images/favicon/favicon.ico'));

// required for passport
app.use(session({
  secret: 'appsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: new Date(Date.now() + 3600000)
  }
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require(__dirname + '\\config\\apiRouter.js')(app, passport); // load our routes and pass in our app and fully configured passport
require(__dirname+ '\\config\\passport.js')(passport); // pass passport for configuration

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

var server = app.listen(port, function() {
    console.log("application is running at port: " + port);

});
