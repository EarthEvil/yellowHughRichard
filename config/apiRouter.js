var mysqlConnection = require(__dirname + '/database.js');
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require(__dirname + '/logger.js');

module.exports = function(app, passport) {
    router.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/index', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    // router.post('/signin', passport.authenticate('local-signin'), function(req, res) {
    //     console.log("redirect to: " + req.user.id);
    //     res.redirect('/loginSuccess/' + req.user.id);
    // });

    // router.post('/signup', function(req, res) {
    //     console.log("you here");
    //     res.send("good");

    // });

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.get('/customer/:customer_id', function(req, res) {
        var query = 'select * from customer where customer_id = ' + req.params.customer_id;
        mysqlConnection.query(query, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.warn("qurey error");
            }
        });
    });

    router.get('/inquire/:account_id', function(req, res) {
        var query = 'select * from transaction where account_id =' + req.params.account_id;
        mysqlConnection.query(query, function(err, rows, fields) {
            logger.info(req.ip + "request query: " + query);
            if (!err) {
                res.send(rows);
            } else {
                logger.warn("qurey error");
                logger.warn(query);
            }
        });
    });

    router.get('/thoughtputTest/:runs', function(req, res) {
        var query = 'select * from transaction limit 1;';
        for (var i = 0; i < 1000; i++) {
            mysqlConnection.query(query);
        }
    });

    router.get('/balanceinqure/:account_id', function(req, res) {

        var query = 'select * from account where account_id =' + req.params.account_id;
        mysqlConnection.query(query, function(err, rows, fields) {
            logger.log(req.ip + " request query: " + query);
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error");
                logger.info(query);
            }
        });
    });




    router.post('/', function(req, res) {
        logger.info("post /");
        res.send('POST request to homepage');
    });

    // HTTP POST 
    router.post('/addCustomer', function(req, res) {
        var name = req.body.name;
        var age = req.body.age;
        var address = req.body.address;
        var query = 'insert into customer (name, age, address)  values("' + name + '" , ' + age + ', "' + address + '")';
        mysqlConnection.query(query, function(err, rows, fields) {
            logger.info(req.ip + " request query: " + query);
            if (!err) {

            } else {
                logger.warn("qurey error");
                logger.warn(query);
            }
        });
        logger.log(name, age, address);
        res.send('POST request to homepage');
    });

    function addTransaction(account_id, transaction_type, amount) {
        var transactionQuery = 'insert into transaction (account_id,transaction_type, amount, time) values (' + account_id + ',  \'' + transaction_type + ' \' , ' + amount + ', ' + 'CURDATE()' + ');';
        // (${account_id},${transaction_type}, ${amount}, CURDATE());';
        mysqlConnection.query(transactionQuery, function(err, rows, fields) {
            if (!err) {
                logger.info("EXECUTED: " + transactionQuery);

                // 
            } else {
                logger.warn("ERROR: " + transactionQuery);
            };
        });
    }
    router.post('/debit', function(req, res) {

        var account_id = req.body.account_id;
        var amount = parseInt(req.body.amount);
        // get amount
        var getAmountQuery = 'select balance from account where account_id = ' + account_id;
        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            // res.json(rows);
            var currentBalance = parseInt(rows[0].balance);
            var newBalane = currentBalance - amount;
            logger.warn("currentBalance:" + currentBalance);
            var updateBalance = 'UPDATE account SET balance=' +
                newBalane + ' WHERE account_id=' +
                account_id + ';'
            mysqlConnection.query(updateBalance, addTransaction(account_id, 'debit', amount));
        });
        res.send('POST request to homepage');
    });

    router.post('/deposit', function(req, res) {

        var account_id = req.body.account_id;
        var amount = parseInt(req.body.amount);
        // get amount
        var getAmountQuery = 'select balance from account where account_id = ' + account_id;
        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            var currentBalance = parseInt(rows[0].balance);
            var newBalane = currentBalance + amount;
            var updateBalance = 'UPDATE account SET balance=' +
                newBalane + ' WHERE account_id=' +
                account_id + ';'
            mysqlConnection.query(updateBalance, addTransaction(account_id, 'deposit', amount));
        });
        res.send('POST request to homepage');
    });
    app.use('/api', router);

    app.get('/signupSuccess/:username', function(req, res) {
        res.send("haha");
        res.json({ username: req.params.username });
    });

    app.get('/loginFail', function(req, res) {
        res.send("fail");
    });

    //pages route
    app.get('/index', isLoggedIn, function(req, res) {
        logger.info("user " + req.user.username + "try to log in");
        res.render('index.ejs', { user: req.user });
    });
    app.get('/balanceInquire', function(req, res) {
        var tagline = "Any code of your own that you haven't look";
        res.render('balanceInquire.ejs', { user: req.user, tagline: tagline });
    });
    app.get('/deposit', function(req, res) {
        res.render('deposit.ejs', { user: req.user });
    });
    app.get('/debit', function(req, res) {
        res.render('debit.ejs', { user: req.user });
    });
    app.get('/inquire', function(req, res) {
        res.render('inquire.ejs', { user: req.user });
    });
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('signupMessage') });
    });
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    var count = 0;
    app.get('/test', function(req, res) {
        count++;
        logger.info("log count: " + count);
        res.send("log count: " + count);
    });

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
