var mysqlConnection = require(__dirname + '/database.js');
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require(__dirname + '/logger.js');
var request = require('request');

module.exports = function(app, passport) {

    router.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/index', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/signupSummary', // redirect to the sign up summary
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.get('/create_account/:amount', function(req, res) {
        var user = req.user.id;
        var amount = req.params.amount;
        console.log(user);
        request({
            url: "http://ec2-54-210-169-238.compute-1.amazonaws.com/generate_account_number",
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        }, function(error, response, body) {
            var sql = 'select user_id from user where username = ?';
            var inserts = [user];
            sql = mysqlConnection.format(sql, inserts);
            // var query = 'select user_id from user where username = ' + user;
            console.log("user: " + user);
            mysqlConnection.query(sql, function(err, rows) {
                if (!err) {
                    console.log("row: " + rows[0].user_id);
                    console.log(body);
                    var sql2 = 'insert into account (user_id,account_number, balance) values (?,?,?);';
                    var inserts = [rows[0].user_id, body, amount];
                    sql2 = mysqlConnection.format(sql2, inserts);
                    mysqlConnection.query(sql2, function(err, rows) {
                        if (!err) {
                            logger.info("successfully");
                            res.send(body);
                        } else {
                            logger.info("query error： " + sql2);
                        }
                    });
                } else {
                    logger.info("query error： " + sql);
                }
            });
        });
    });



    router.get('/user/:username', function(req, res) {
        var sql = 'select username, first_name, last_name, phone_number, email, gender, income, date_of_birth, address from user where username = ?;';
        var inserts = [req.params.username];
        sql = mysqlConnection.format(sql, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error: " + sql);

                res.status(401).send("fk");
            }
        });
    });

    router.get('/get_account_info/:username', function(req, res) {
        var sql = 'select account_id, account_number, balance from account join (select user_id from user where username = ?) user_table;';
        var inserts = [req.params.username];
        sql = mysqlConnection.format(sql, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error: " + sql);

                res.status(401).send("fk");
            }
        });
    });



    router.get('/inquire/:account_id', function(req, res) {
        var query = 'select * from transaction where account_id =' + req.params.account_id;
        logger.info(req.user.id + " request query: " + query);
        mysqlConnection.query(query, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error");
                logger.info(query);
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
        logger.log(JSON.stringify(req.user) + " request query: " + query);

        var query = 'select * from account where account_id =' + req.params.account_id;
        mysqlConnection.query(query, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error");
                logger.info(query);
            }
        });
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
                logger.info("qurey error");
                logger.warn(query);
            }
        });
        logger.log(name, age, address);
        res.send('POST request to homepage');
    });

    function addTransaction(account_id, transaction_type, amount) {
        var transactionQuery = 'insert into transaction (account_id,transaction_type, amount, time) values (' +
            account_id + ',  \'' + transaction_type + ' \' , ' + amount + ', ' + 'CURDATE()' + ');';
        // (${account_id},${transaction_type}, ${amount}, CURDATE());';
        mysqlConnection.query(transactionQuery, function(err, rows, fields) {
            if (!err) {
                logger.info("EXECUTED: " + transactionQuery);

                // 
            } else {
                logger.info("ERROR: " + transactionQuery);
            };
        });
    };

    router.post('/debit', function(req, res) {
        var account_id = req.body.account_id;
        var amount = parseInt(req.body.amount);
        logger.log(req.ip + " debit " + amount + " from account " + account_id);
        // get amount
        var getAmountQuery = 'select balance from account where account_id = ' + account_id;
        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            // res.json(rows);
            if (!err) {
                if (rows[0] != null && rows[0].balance != null) {
                    var currentBalance = parseInt(rows[0].balance);
                    var newBalane = currentBalance - amount;
                    if (newBalane >= 0) {
                        logger.info("currentBalance:" + currentBalance);
                        var updateBalance = 'UPDATE account SET balance=' +
                            newBalane + ' WHERE account_id=' +
                            account_id + ';'
                        mysqlConnection.query(updateBalance, addTransaction(account_id, 'debit', amount));
                        res.send('POST success');

                    } else {
                        logger.info("insufficient ");
                        res.status(400);
                        res.send('None shall pass');
                    }

                } else {
                    logger.info("wrong account_number ");
                    res.status(400);
                    res.send('None shall pass');
                }
            } else {
                logger.info("qurey error");
                logger.infos(query);
                res.status(400);
                res.send('None shall pass');
            }
        });
    });

    router.post('/deposit', function(req, res) {
        var account_id = req.body.account_id;
        var amount = parseInt(req.body.amount);
        logger.log(req.ip + " deposit " + amount + " to account " + account_id);

        var getAmountQuery = 'select balance from account where account_id = ' + account_id;
        // get amount
        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            if (!err) {
                if (rows[0] != null && rows[0].balance != null) {
                    var currentBalance = parseInt(rows[0].balance);
                    var newBalane = currentBalance + amount;
                    var updateBalance = 'UPDATE account SET balance=' +
                        newBalane + ' WHERE account_id=' +
                        account_id + ';'
                    mysqlConnection.query(updateBalance, addTransaction(account_id, 'deposit', amount));
                    res.send('POST success');

                } else {
                    logger.info("no such account");

                    res.status(400);
                    res.send('None shall pass');
                }
            } else {
                res.status(400);
                res.send('None shall pass');
                logger.info("qurey error");
                logger.info(query);
            }
        });

    });

    app.get('/signupSuccess/:username', function(req, res) {
        logger.info(req.ip + "successfully signup as " + req.params.username);
        res.send("haha");
        res.json({ username: req.params.username });
    });

    app.get('/loginFail', function(req, res) {
        res.send("fail");
    });

    app.use('/api', router);
}
