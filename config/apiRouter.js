var express = require('express');
var router = express.Router();
var path = require('path');
var middleware = require(__dirname + '/middleware.js');
var logger = require(__dirname + '/loggerWraper.js');

const INFO_LEVEL = "info";
const WARN_LEVEL = "warn";
const ERROR_LEVEL = "error";

// const SQL query string 

module.exports = function(app, passport) {
    app.use('/api', router);
    // sign in check
    router.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/index', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // router.post('/signin', function(req, res, next) {
    //     passport.authenticate('local-signin', function(err, user, info) {
    //         if (err) {
    //             return res.redirect('/');
    //         }
    //         if (!user) {
    //             return res.redirect('/');
    //         }
    //         req.logIn(user, function(err) {
    //             return res.redirect("/index");
    //         });
    //     })(req, res, next);
    // });

    // sign up check
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/signupSummary', // redirect to the sign up summary
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // handle HTTP GET requests
    router.get('/create_account/:amount', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.createAccount(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.api_log(req, res, INFO_LEVEL, Date(), "create_account", hrend[1] / 1000000);

        });
    });

    router.delete('/delete_account/:account_number', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.deleteAccount(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.api_log(req, res, INFO_LEVEL, Date(), "delete_account", hrend[1] / 1000000);

        });
    });

    router.get('/user/:username', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.getUser(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.api_log(req, res, INFO_LEVEL, Date(), "get_user", hrend[1] / 1000000);
        });
    });

    router.get('/get_account_info/:username', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.getUserAccountInfo(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.api_log(req, res, INFO_LEVEL, Date(), "get_account_info", hrend[1] / 1000000);
        });
    });

    router.get('/inquire/:account_id', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.transactionInquire(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.api_log(req, res, INFO_LEVEL, Date(), "transaction_inquire", hrend[1] / 1000000);
        });
    });

    router.get('/balanceinqure/:account_id', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.getBalance(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.api_log(req, res, INFO_LEVEL, Date(), "balance_inqure", hrend[1] / 1000000);
        });
    });

    // Handle HTTP POST requests
    router.post('/debit', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.debit(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.api_log(req, res, INFO_LEVEL, Date(), "debit", hrend[1] / 1000000);
        });
    });

    router.post('/deposit', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.deposit(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.api_log(req, res, INFO_LEVEL, Date(), "deposit", hrend[1] / 1000000);
        });
    });

    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
        } else {
            logger.api_log(req, res, WARN_LEVEL, Date(), "isLoggedIn", 'null');
        }
    }
}
