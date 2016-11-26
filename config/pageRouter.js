var mysqlConnection = require(__dirname + '/database.js');
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require(__dirname + '/logger.js');


module.exports = function(app) {
    //pages route
    router.get('/index', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('index.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access home page. Send index.ejs in  %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/deposit', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('deposit.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access deposit page. Send deposit.ejs in  %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/debit', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('debit.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access debit page. Send debit.ejs in  %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/accountManagement', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('account_management.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access account_management page. Send account_management.ejs in  %dms.", hrend[1] / 1000000);
        });
    });
    router.get('/', function(req, res) {
        var hrstart = process.hrtime();
        res.render('login.ejs', { message: req.flash('signInMessage') }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access login page. Send login.ejs in  %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/signup', function(req, res) {
        var hrstart = process.hrtime();
        res.render('signup.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access signup page. Send signup.ejs in  %dms.", hrend[1] / 1000000);
        });
        res.render('signup.ejs', { message: req.flash('signUpMessage') });
    });
    router.get('/signupSummary', function(req, res) {
        var hrstart = process.hrtime();
        res.render('signupSummary.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access signupSummary page. Send signupSummary.ejs in  %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/privacyPolicy', function(req, res) {
        var hrstart = process.hrtime();
        res.render('privacyPolicy.ejs', function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access privacyPolicy page. Send privacyPolicy.ejs in  %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/location', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('location.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access location page. Send location.ejs in  %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/profile', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        res.render('profile.ejs', { user: req.user }, function(err, result) {
            res.send(result);
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " access profile page. Send profile.ejs in  %dms.", hrend[1] / 1000000);
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
            logger.info(req.user.username + "is authenticated");
            return next();
        }
        logger.info("Unauthenticated " + req.ip + "tries to access" + JSON.stringify(req.url));
        // if they aren't redirect them to the home page
        res.redirect('/');
    }

}
