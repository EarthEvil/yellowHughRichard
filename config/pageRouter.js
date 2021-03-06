var mysqlConnection = require(__dirname + '/database.js');
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require(__dirname + '/loggerWraper.js');
const INFO_LEVEL = "info";
const WARN_LEVEL = "warn";
const ERROR_LEVEL = "error";

module.exports = function(app) {
    //pages route
    router.get('/', function(req, res) {
        var hrstart = process.hrtime();
        res.render('login.ejs', { message: req.flash('signInMessage') }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });

    router.get('/index', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('index.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });

    router.get('/deposit', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('deposit.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });

    router.get('/debit', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('debit.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });

    router.get('/accountManagement', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('account_management.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });


    router.get('/signup', function(req, res) {
        var hrstart = process.hrtime();
        res.render('signup.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
        res.render('signup.ejs', { message: req.flash('signUpMessage') });
    });
    router.get('/signupSummary', function(req, res) {
        var hrstart = process.hrtime();
        res.render('signupSummary.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });

    router.get('/privacyPolicy', function(req, res) {
        var hrstart = process.hrtime();
        res.render('privacyPolicy.ejs', function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });

    router.get('/location', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('location.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });

    router.get('/profile', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('profile.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.page_log(req, res, INFO_LEVEL, Date(), hrend[1] / 1000000);
        });
    });

    router.get('/logout', function(req, res) {
        res.redirect('/');
    });

    app.use('/', router)

    // route middleware to make sure a user is signed in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
        } else {
            // if they aren't, redirect them to the login page
            // logger.ERROR_LEVEL("Unauthenticated reqest to " + JSON.stringify(req.url) + "from " + req.ip);
            res.redirect('/');
        }
    }

}
