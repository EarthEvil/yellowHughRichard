var mysqlConnection = require(__dirname + '/database.js');
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require(__dirname + '/logger.js');

module.exports = function(app) {

    //pages route
    router.get('/index', isLoggedIn, function(req, res) {
        logger.info(req.ip + " try to log in as " + req.user.username);
        res.render('index.ejs', { user: req.user });
    });
    router.get('/balanceInquire', function(req, res) {
        var tagline = "Any code of your own that you haven't look";
        res.render('balanceInquire.ejs', { user: req.user, tagline: tagline });
    });
    router.get('/deposit', function(req, res) {
        res.render('deposit.ejs', { user: req.user });
    });
    router.get('/debit', function(req, res) {
        res.render('debit.ejs', { user: req.user });
    });
    router.get('/inquire', function(req, res) {
        res.render('inquire.ejs', { user: req.user });
    });
    router.get('/', function(req, res) {
        logger.info(req.ip + " access log in page");
        res.render('login.ejs', { message: req.flash('signupMessage') });
    });
    router.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    router.get('/signupSummary', function(req, res) {
        // res.status(200);
        logger.info("signupSummary Page")
        res.render('signupSummary.ejs', { user: req.user });
    });
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use('/', router)
        // route middleware to make sure a user is signed in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            logger.info(req.user.username + "is authenticated");
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('/');
    }

}
