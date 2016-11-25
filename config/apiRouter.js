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
        middleware.createAccount(req, res);
    });

    router.delete('/delete_account/:account_number', isLoggedIn, function(req, res) {
        middleware.deleteAccount(req, res);
    });

    router.get('/user/:username', isLoggedIn, function(req, res) {
        middleware.getUser(req, res);
    });

    router.get('/get_account_info/:username', isLoggedIn, function(req, res) {
        middleware.getUserAccount(req, res);
    });

    router.get('/inquire/:account_id', isLoggedIn, function(req, res) {
        middleware.transactionInquire(req, res);
    });

    router.get('/balanceinqure/:account_id', isLoggedIn, function(req, res) {
        middleware.getBalance(req, res);
    });

    // Handle HTTP POST requests
    router.post('/debit', isLoggedIn, function(req, res) {
        middleware.debit(req, res);
    });

    router.post('/deposit', isLoggedIn, function(req, res) {
        middleware.deposit(req, res);
    });

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            logger.info(req.ip + " is authenticated");
            return next();
        }
        logger.info(req.ip + " is NOT authenticated");
        logger.info(req.ip + " try to access API: " + JSON.stringify(req.url));
        // if they aren't redirect them to the home page
        res.send({ error_message: "Not Authentication." })
    }
}
