var express = require('express');
var router = express.Router();
var path = require('path');
var middleware = require(__dirname + '/middleware.js');

// const SQL query string 

module.exports = function(app, passport) {
    app.use('/api', router);
    // sign in check
    router.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/index', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // sign up check
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/signupSummary', // redirect to the sign up summary
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // handle HTTP GET requests
    router.get('/create_account/:amount', function(req, res) {
        middleware.createAccount(req, res);
    });

    router.delete('/delete_account/:account_number', function(req, res) {
        middleware.deleteAccount(req, res);
    });

    router.get('/user/:username', function(req, res) {
        middleware.getUser(req, res);
    });

    router.get('/get_account_info/:username', function(req, res) {
        middleware.getUserAccount(req, res);
    });

    router.get('/inquire/:account_id', function(req, res) {
        middleware.transactionInquire(req, res);
    });

    router.get('/balanceinqure/:account_id', function(req, res) {
        middleware.getBalance(req, res);
    });

    // Handle HTTP POST requests
    router.post('/debit', function(req, res) {
        middleware.debit(req, res);
    });

    router.post('/deposit', function(req, res) {
        middleware.deposit(req, res);
    });

}
