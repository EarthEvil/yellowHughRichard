var mysqlConnection = require(__dirname + '/database.js');
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require(__dirname + '/logger.js');
var request = require('request');

// const SQL query string 


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

    router.delete('/delete_account/:account_number', function(req, res) {
        var account_number = req.params.account_number;
        var sql = 'SELECT account_id FROM account WHERE account_number = ?;';
        var inserts = [account_number];
        sql = mysqlConnection.format(sql, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                if (rows[0] != null) {
                    var deleteSQL = 'DELETE FROM account WHERE account_id = ?';
                    var inserts = [parseInt(rows[0].account_id)];
                    deleteSQL = mysqlConnection.format(deleteSQL, inserts);
                    mysqlConnection.query(deleteSQL, function(err, rows, fields) {
                        if (!err) {
                            res.send("Delete account " + account_number);
                        } else {
                            res.send("Failed to Delete Account");
                        }
                    });
                } else {
                    res.send("Not such account, Please check your account number.");
                }


            } else {
                logger.info("QUERY ERROR: " + sql);
                res.send("Failed to Delete Account");
            }
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
        var sql = 'select * from transaction where account_id= ?';
        var inserts = [req.params.account_id];
        sql = mysqlConnection.format(sql, inserts);
        logger.info(req.user.id + " request query: " + sql);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error");
                logger.info(sql);
            }
        });
    });


    router.get('/balanceinqure/:account_id', function(req, res) {
        var sql = 'select * from account where account_id= ?';
        var inserts = [req.params.account_id];
        sql = mysqlConnection.format(sql, inserts);
        logger.log(JSON.stringify(req.user) + " request query: " + sql);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error");
                logger.info(sql);
            }
        });
    });

    // HTTP POST 
    function getAccountId(account_number, callback) {
        var sql = 'select account_id from account where account_number = ?';
        var inserts = [account_number];
        sql = mysqlConnection.format(sql, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                logger.info("rows: " + JSON.stringify(rows));
                return rows[0].account_id;
            } else {
                logger.info("ERROR: " + sql);
                return null;
            };
        });
    }

    function addTransaction(account_number, transaction_type, amount) {
        // find account_id by account_number

        var sql = 'select account_id from account where account_number = ?';
        var inserts = [account_number];
        sql = mysqlConnection.format(sql, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                logger.info("rows: " + JSON.stringify(rows));
                if (rows[0] != null && rows[0].account_id != null) {
                    var sql = 'insert into transaction (account_id,transaction_type, amount, time) values (?,?,?, NOW())';
                    var inserts = [rows[0].account_id, transaction_type, amount];
                    sql = mysqlConnection.format(sql, inserts);
                    mysqlConnection.query(sql, function(err, rows, fields) {
                        if (!err) {
                            logger.info("EXECUTED: " + sql);
                        } else {
                            logger.info("ERROR: " + sql);
                        };
                    });
                }
                return rows[0].account_id;
            } else {
                logger.info("ERROR: " + sql);
                return null;
            };
        });
    };

    router.post('/debit', function(req, res) {
        var account_number = req.body.account_number;
        var amount = parseInt(req.body.amount);
        logger.log(req.ip + " debit " + amount + " from account " + account_number);
        // get amount
        var getAmountQuery = 'select balance from account where account_number = ?';
        var inserts = [account_number];
        getAmountQuery = mysqlConnection.format(getAmountQuery, inserts);

        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            // res.json(rows);
            if (!err) {
                if (rows[0] != null && rows[0].balance != null) {
                    var currentBalance = parseInt(rows[0].balance);
                    var newBalane = currentBalance - amount;
                    if (newBalane >= 0) {
                        var updateBalanceQuery = 'update account set balance = ? where account_number = ?';
                        var inserts = [newBalane, account_number];
                        updateBalanceQuery = mysqlConnection.format(updateBalanceQuery, inserts);
                        mysqlConnection.query(updateBalanceQuery, addTransaction(account_number, 'debit', amount));
                        res.send('POST success');
                    } else {
                        logger.info("insufficient fund");
                        res.status(400);
                        res.send('insufficient fund');
                    }

                } else {
                    logger.info("no such account");
                    res.status(400);
                    res.send('no such account');
                }
            } else {
                logger.info("qurey error");
                logger.infos(query);
                res.status(400);
                res.send('query error');
            }
        });
    });

    router.post('/deposit', function(req, res) {
        var account_number = req.body.account_number;
        var amount = parseInt(req.body.amount);
        logger.log(req.ip + " deposit " + amount + " to account " + account_number);

        var getAmountQuery = 'select balance from account where account_number = ' + account_number;
        // get amount
        var getAmountQuery = 'select balance from account where account_number = ?';
        var inserts = [account_number];
        getAmountQuery = mysqlConnection.format(getAmountQuery, inserts);

        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            if (!err) {
                if (rows[0] != null && rows[0].balance != null) {
                    var currentBalance = parseInt(rows[0].balance);
                    var newBalane = currentBalance + amount;
                    // get account_id from 

                    var updateBalanceQuery = 'UPDATE account SET balance= ? WHERE account_number= ? '
                    var inserts = [newBalane, account_number];
                    updateBalanceQuery = mysqlConnection.format(updateBalanceQuery, inserts);

                    mysqlConnection.query(updateBalanceQuery, addTransaction(account_number, 'deposit', amount));
                    res.send('POST success');

                } else {
                    logger.info("no such account");

                    res.status(400);
                    res.send('None shall pass');
                }
            } else {
                res.status(400);
                res.send('qurey error');
                logger.info("qurey error: " + query);
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
