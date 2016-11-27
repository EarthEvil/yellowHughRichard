var express = require('express');
var router = express.Router();
var path = require('path');
var middleware = require(__dirname + '/middleware.js');
var logger = require(__dirname + '/logger.js');

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
            logger.info(req.ip + "performs createsAaccount, takes %dms.", hrend[1] / 1000000);
        });
    });

    router.delete('/delete_account/:account_number', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.deleteAccount(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + "performs deleteAccount, takes %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/user/:username', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.getUser(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " performs getUsers, takes %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/get_account_info/:username', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.getUserAccountInfo(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " performs get_account_info, takes %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/inquire/:account_id', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.transactionInquire(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " performs transaction inqure, takes %dms.", hrend[1] / 1000000);
        });
    });

    router.get('/balanceinqure/:account_id', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.getBalance(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " performs balance inqure, takes %dms.", hrend[1] / 1000000);
        });
    });

    // Handle HTTP POST requests
    router.post('/debit', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.debit(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " performs debit, takes %dms.", hrend[1] / 1000000);
        });
    });

    router.post('/deposit', isLoggedIn, function(req, res) {
        var hrstart = process.hrtime();
        middleware.deposit(req, res, function() {
            var hrend = process.hrtime(hrstart);
            logger.info(req.ip + " performs deposit, takes %dms.", hrend[1] / 1000000);
        });
    });

    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
        } else {
            logger.warn("Unauthenticated reqest to " + JSON.stringify(req.url) + " from " + req.ip);
            res.send({ error_message: "Not Authentication." })
        }
    }
}
