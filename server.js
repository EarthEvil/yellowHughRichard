require('@risingstack/trace');

// your application's code
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
var path = require('path');
var logger = require(__dirname + '/config/logger.js');
var responseTime = require('response-time')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon/favicon.ico'));
app.set('view engine', 'ejs');
// app.use(responseTime());

// required for passport
app.use(session({ secret: 'appsecret' }));
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require(__dirname + '/config/apiRouter.js')(app, passport);
require(__dirname + '/config/pageRouter.js')(app);
require(__dirname + '/config/passport.js')(passport); // pass passport for configuration

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

var server = app.listen(port, function() {
    // logger.info("application is running at port: " + port);
    logger.info({ messages: "application is running at port: " + port });

});

// setInterval(function() {
//     server.getConnections(function(error, count) {
//         console.log("number of connection: " + count);

//     });
// }, 1000);

// properly handle SIGINT 
process.on('SIGINT', function() {
    logger.info("exit program with SIGINT");
    server.close(function() {
        logger.info("server close on", server.address());
    })
    process.exit();
});
