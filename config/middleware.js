var logger = require(__dirname + '/logger.js');
var mysqlConnection = require(__dirname + '/database.js');
var request = require('request');

var middleware = {
    getUserAccountSQL: 'select account_id, a.user_id, account_number, balance from account a join (select user_id from user where username = ?) user_table where a.user_id = user_table.user_id',
    transactionInquireSQL: 'select * from transaction where account_id= ?',
    get_user_id_SQL: 'select user_id from user where username = ?',
    insert_new_account_SQL: 'insert into account (user_id,account_number, balance) values (?,?,?);',
    get_account_id_SQL: 'SELECT account_id FROM account WHERE account_number = ?',
    delete_account_SQL: 'DELETE FROM account WHERE account_id = ?',
    get_user_info_SQL: 'select username, first_name, last_name, phone_number, email, gender, income, date_of_birth, address from user where username = ?;',
    get_account_info_SQL: 'select * from account where account_id= ?',
    insert_transaction_SQL: 'insert into transaction (account_id,transaction_type, amount, time) values (?,?,?, NOW())',
    get_balance_SQL: 'select balance from account where account_number = ?',
    update_balance_SQL: 'UPDATE account SET balance= ? WHERE account_number= ?',

    getUserAccount: function(req, res) {
        var inserts = [req.params.username];
        sql = mysqlConnection.format(middleware.getUserAccountSQL, inserts);
        console.log(sql);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                // logger.info("qurey error: " + sql);

                res.status(401).send("fk");
            }
        });
    },

    transactionInquire: function(req, res) {
        var inserts = [req.params.account_id];
        sql = mysqlConnection.format(middleware.transactionInquireSQL, inserts);
        logger.info(req.user.id + " request query: " + sql);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error");
                logger.info(sql);
            }
        });
    },
    createAccount: function(req, res) {
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
            // var sql = 'select user_id from user where username = ?';
            var inserts = [user];
            sql = mysqlConnection.format(middleware.get_user_id_SQL, inserts);
            mysqlConnection.query(sql, function(err, rows) {
                if (!err) {
                    var inserts = [rows[0].user_id, body, amount];
                    sql2 = mysqlConnection.format(middleware.insert_new_account_SQL, inserts);
                    mysqlConnection.query(sql2, function(err, rows) {
                        if (!err) {
                            res.send("Congratulation! You have create account. Your new account number is " + body);
                        } else {
                            logger.info("query error： " + sql2);
                            res.send("Sorry, failed to create new account");
                        }
                    });
                } else {
                    logger.info("query error： " + sql);
                    res.send("Sorry, failed to create new account");
                }
            });
        });
    },
    deleteAccount: function(req, res) {
        var account_number = req.params.account_number;
        var inserts = [account_number];
        sql = mysqlConnection.format(middleware.get_account_id_SQL, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                if (rows[0] != null) {
                    var inserts = [parseInt(rows[0].account_id)];
                    deleteSQL = mysqlConnection.format(delete_account_SQL, inserts);
                    mysqlConnection.query(deleteSQL, function(err, rows, fields) {
                        if (!err) {
                            res.send("YOU HAVE DELETED ACCOUNT: " + account_number);
                        } else {
                            res.send("FAILED TO DELETE ACCOUNT: " + account_number);
                        }
                    });
                } else {
                    res.send("NOT SUCH ACCOUNT, PLEASE CHECK YOUR ACCOUNT NUMBER.");
                }


            } else {
                logger.info("QUERY ERROR: " + sql);
                res.send("FAILED TO DELETE ACCOUNT: " + account_number);
            }
        });
    },
    getUser: function(req, res) {
        var inserts = [req.params.username];
        sql = mysqlConnection.format(middleware.get_user_info_SQL, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error: " + sql);

                res.send("Not such user");
            }
        });
    },
    getBalance: function(req, res) {
        var inserts = [req.params.account_id];
        sql = mysqlConnection.format(middleware.get_account_info_SQL, inserts);
        logger.log(JSON.stringify(req.user) + " request query: " + sql);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                logger.info("qurey error");
                logger.info(sql);
            }
        });
    },
    getAccountId: function(account_number, callback) {
        var inserts = [account_number];
        sql = mysqlConnection.format(middleware.get_account_id_SQL, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                logger.info("rows: " + JSON.stringify(rows));
                return rows[0].account_id;
            } else {
                logger.info("ERROR: " + sql);
                return null;
            };
        });
    },
    addTransaction: function(account_number, transaction_type, amount) {
        /// find account_id by account_number
        var inserts = [account_number];
        sql = mysqlConnection.format(middleware.get_account_id_SQL, inserts);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                logger.info("rows: " + JSON.stringify(rows));
                if (rows[0] != null && rows[0].account_id != null) {
                    var inserts = [rows[0].account_id, transaction_type, amount];
                    sql = mysqlConnection.format(middleware.insert_transaction_SQL, inserts);
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
    },

    deposit: function(req, res) {
        var account_number = req.body.account_number;
        var amount = parseInt(req.body.amount);
        logger.log(req.ip + " deposit " + amount + " to account " + account_number);
        // get amount
        var inserts = [account_number];
        getAmountQuery = mysqlConnection.format(middleware.get_balance_SQL, inserts);

        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            if (!err) {
                if (rows[0] != null && rows[0].balance != null) {
                    var currentBalance = parseInt(rows[0].balance);
                    var newBalane = currentBalance + amount;
                    var inserts = [newBalane, account_number];
                    updateBalanceQuery = mysqlConnection.format(middleware.update_balance_SQL, inserts);

                    mysqlConnection.query(updateBalanceQuery, middleware.addTransaction(account_number, 'deposit', amount));
                    res.send('YOU HAVE DEPOSIT $' + amount + ' TO ACCOUNT ' + account_number + '. NEW BALANCE IS: $' + newBalane);

                } else {
                    logger.info("no such account");
                    res.send("NOT SUCH ACCOUNT, PLEASE CHECK YOUR ACCOUNT NUMBER.");
                }
            } else {
                logger.info("qurey error: " + query);
                res.send('FAILED TO DEPOSIT $' + amount + ' TO ACCOUNT ' + account_number + '.');
            }
        });
    },
    debit: function(req, res) {
        var account_number = req.body.account_number;
        var amount = parseInt(req.body.amount);
        logger.log(req.ip + " debit " + amount + " from account " + account_number);
        // get amount
        var inserts = [account_number];
        getAmountQuery = mysqlConnection.format(middleware.get_balance_SQL, inserts);

        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            // res.json(rows);
            if (!err) {
                if (rows[0] != null && rows[0].balance != null) {
                    var currentBalance = parseInt(rows[0].balance);
                    var newBalane = currentBalance - amount;
                    if (newBalane >= 0) {
                        var inserts = [newBalane, account_number];
                        updateBalanceQuery = mysqlConnection.format(middleware.update_balance_SQL, inserts);
                        mysqlConnection.query(updateBalanceQuery, middleware.addTransaction(account_number, 'debit', amount));
                        res.send('YOU HAVE DEBITED $' + amount + ' FROM ACCOUNT ' + account_number + '. NEW BALANCE IS: $' + newBalane);
                    } else {
                        logger.info("insufficient fund");
                        res.send('INSUFFICIENT FUND IN ACCOUNT ' + account_number);
                    }

                } else {
                    logger.info("no such account");
                    res.send("NOT SUCH ACCOUNT, PLEASE CHECK YOUR ACCOUNT NUMBER.");
                }
            } else {
                logger.info("qurey error： " + query);
                res.send('FAILED TO DEBIT $' + amount + ' FROM ACCOUNT ' + account_number + '.');
            }
        });
    }

}

module.exports = middleware;
