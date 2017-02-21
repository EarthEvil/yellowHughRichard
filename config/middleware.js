var mysqlConnection = require(__dirname + '/database.js');
var logger = require(__dirname + '/loggerWraper.js');
var request = require('request');
var geoip = require('geoip-lite');

const INFO_LEVEL = "info";
const WARN_LEVEL = "warn";
const ERROR_LEVEL = "error";

var middleware = {
    getUserAccountSQL: 'select account_id, a.user_id, account_number, balance from account a join (select user_id from user where username = ?) user_table where a.user_id = user_table.user_id',
    transaction_inquire_SQL: 'select * from transaction where account_id= ?',
    get_user_id_SQL: 'select user_id from user where username = ?',
    insert_new_account_SQL: 'insert into account (user_id,account_number, balance) values (?,?,?);',
    get_account_id_SQL: 'SELECT account_id FROM account WHERE account_number = ?',
    delete_account_SQL: 'DELETE FROM account WHERE account_id = ?',
    get_user_profile_SQL: 'select username, first_name, last_name, phone_number, email, gender, income, date_of_birth, address from user where username = ?;',
    get_account_info_SQL: 'select * from account where account_id= ?',
    insert_transaction_SQL: 'insert into transaction (account_id,transaction_type, amount, time) values (?,?,?, NOW())',
    get_balance_SQL: 'select balance from account where account_number = ?',
    update_balance_SQL: 'UPDATE account SET balance= ? WHERE account_number= ?',
    save_login_history_SQL: 'insert into login_history(user_id, username, ip_address,time, location) values(?,?,?, NOW(), ?) ON DUPLICATE KEY UPDATE user_id = ?',
    last_login_SQL: 'select * from login_history where user_id = ? order by time desc limit 1',
    formatIP: function(ip) {
        if (ip.substr(0, 7) == "::ffff:") {
            ip = ip.substr(7)
        }
        return ip;
    },

    saveLoginHistory: function(req, username, callback) {
        var ip = req.ip;
        var geo = geoip.lookup(ip);
        var physical_location = geo["city"] + ", " + geo["region"] + ", " + geo["country"];

        var inserts = [username];
        var sql = mysqlConnection.format(middleware.get_user_id_SQL, inserts);
        var hrstart1 = process.hrtime();

        mysqlConnection.query(sql, function(err, rows) {
            var hrend1 = process.hrtime(hrstart1); // in ms

            if (!err) {
                var inserts = [rows[0].user_id, username, ip, physical_location, rows[0].user_id];
                var sql2 = mysqlConnection.format(middleware.save_login_history_SQL, inserts);
                var hrstart2 = process.hrtime();
                mysqlConnection.query(sql2, function(err, rows) {
                    var hrend2 = process.hrtime(hrstart2); // in ms
                    if (!err) {
                        logger.sql_log(req, INFO_LEVEL, Date(), sql2, rows, err, hrend2[1] / 1000000)
                        if (callback && typeof(callback) === "function") {
                            callback();
                        }
                    } else {
                        logger.sql_log(req, ERROR_LEVEL, Date(), sql2, rows, err, hrend[1] / 1000000)
                        if (callback && typeof(callback) === "function") {
                            callback();
                        }
                    }
                });
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend1[1] / 1000000)
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            }
        });
    },

    getLastLogin: function(req, res) {

    },

    getUserAccountInfo: function(req, res, callback) {
        var inserts = [req.params.username];
        var sql = mysqlConnection.format(middleware.getUserAccountSQL, inserts);
        var hrstart = process.hrtime();
        mysqlConnection.query(sql, function(err, rows, fields) {
            var hrend = process.hrtime(hrstart); // in ms
            if (!err) {
                logger.sql_log(req, INFO_LEVEL, Date(), sql, rows, err, hrend[1] / 1000000)
                res.send(rows);
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend[1] / 1000000)
                res.status(401).send("fk");
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            }
        });
    },

    transactionInquire: function(req, res, callback) {
        var inserts = [req.params.account_id];
        var sql = mysqlConnection.format(middleware.transaction_inquire_SQL, inserts);
        var hrstart = process.hrtime();
        mysqlConnection.query(sql, function(err, rows, fields) {
            var hrend = process.hrtime(hrstart);
            if (!err) {
                logger.sql_log(req, INFO_LEVEL, Date(), sql, rows, err, hrend[1] / 1000000)
                res.send(rows);
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend[1] / 1000000)
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            }
        });
    },
    createAccount: function(req, res, callback) {
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
            var inserts = [user];
            var sql = mysqlConnection.format(middleware.get_user_id_SQL, inserts);
            var hrstart1 = process.hrtime();
            mysqlConnection.query(sql, function(err, rows) {
                var hrend1 = process.hrtime(hrstart1); // in ms
                if (!err) {
                    var inserts = [rows[0].user_id, body, amount];
                    var sql2 = mysqlConnection.format(middleware.insert_new_account_SQL, inserts);
                    var hrstart2 = process.hrtime();
                    mysqlConnection.query(sql2, function(err, rows) {
                        var hrend2 = process.hrtime(hrstart2); // in ms
                        if (!err) {
                            logger.sql_log(req, INFO_LEVEL, Date(), sql2, rows, err, hrend2[1] / 1000000)
                            res.send("Congratulation! You have create account. Your new account number is " + body);
                            if (callback && typeof(callback) === "function") {
                                callback();
                            }
                        } else {
                            logger.sql_log(req, ERROR_LEVEL, Date(), sql2, rows, err, hrend2[1] / 1000000)
                            res.send("Sorry, failed to create new account");
                            if (callback && typeof(callback) === "function") {
                                callback();
                            }
                        }
                    });
                } else {
                    logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend1[1] / 1000000)
                    res.send("Sorry, failed to create new account");
                    if (callback && typeof(callback) === "function") {
                        callback();
                    }
                }
            });
        });
    },

    deleteAccount: function(req, res, callback) {
        var account_number = req.params.account_number;
        var inserts = [account_number];
        var sql = mysqlConnection.format(middleware.get_account_id_SQL, inserts);
        var hrstart1 = process.hrtime();

        mysqlConnection.query(sql, function(err, rows, fields) {
            var hrend1 = process.hrtime(hrstart1); // in ms

            if (!err) {
                if (rows[0] != null) {
                    var inserts = [parseInt(rows[0].account_id)];
                    var deleteSQL = mysqlConnection.format(middleware.delete_account_SQL, inserts);
                    var hrstart2 = process.hrtime();
                    mysqlConnection.query(deleteSQL, function(err, rows, fields) {
                        var hrend2 = process.hrtime(hrstart2); // in ms
                        if (!err) {
                            logger.sql_log(req, INFO_LEVEL, Date(), deleteSQL, rows, err, hrend2[1] / 1000000)
                            res.send("YOU HAVE DELETED ACCOUNT: " + account_number);
                            if (callback && typeof(callback) === "function") {
                                callback();
                            }
                        } else {
                            logger.sql_log(req, ERROR_LEVEL, Date(), deleteSQL, rows, err, hrend2[1] / 1000000)
                            res.send("FAILED TO DELETE ACCOUNT: " + account_number);
                            if (callback && typeof(callback) === "function") {
                                callback();
                            }
                        }
                    });
                } else {
                    logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, { errorMessage: "empty set" }, hrend2[1] / 1000000)

                    res.send("NOT SUCH ACCOUNT, PLEASE CHECK YOUR ACCOUNT NUMBER.");
                    if (callback && typeof(callback) === "function") {
                        callback();
                    }
                }
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend1[1] / 1000000)
                res.send("FAILED TO DELETE ACCOUNT: " + account_number);
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            }
        });
    },
    getUser: function(req, res, callback) {
        var inserts = [req.params.username];
        var sql = mysqlConnection.format(middleware.get_user_profile_SQL, inserts);
        var hrstart = process.hrtime();
        mysqlConnection.query(sql, function(err, rows, fields) {
            var hrend = process.hrtime(hrstart); // in ms
            if (!err) {
                logger.sql_log(req, INFO_LEVEL, Date(), sql, rows, err, hrend[1] / 1000000)
                res.send(rows);
                callback();
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend1[1] / 1000000)
                res.send("Not such user");
                callback();
            }
        });
    },
    getBalance: function(req, res, callback) {
        var inserts = [req.params.account_id];
        var sql = mysqlConnection.format(middleware.get_account_info_SQL, inserts);
        var hrstart = process.hrtime();
        mysqlConnection.query(sql, function(err, rows, fields) {
            var hrend = process.hrtime(hrstart); // in ms
            if (!err) {
                logger.sql_log(req, INFO_LEVEL, Date(), sql, rows, err, hrend[1] / 1000000)
                res.send(rows);
                callback();
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend1[1] / 1000000)
                callback();
            }
        });
    },
    getAccountId: function(account_number, callback) {
        var inserts = [account_number];
        var sql = mysqlConnection.format(middleware.get_account_id_SQL, inserts);
        var hrstart = process.hrtime();

        mysqlConnection.query(sql, function(err, rows, fields) {
            var hrend = process.hrtime(hrstart); // in ms
            if (!err) {
                logger.sql_log(req, INFO_LEVEL, Date(), sql, rows, err, hrend[1] / 1000000)
                return rows[0].account_id;
                callback();
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend1[1] / 1000000)
                return null;
                callback();
            };
        });
    },
    addTransaction: function(req, account_number, transaction_type, amount) {
        return new Promise(function(resolve, reject) {

            /// find account_id by account_number
            var inserts = [account_number];
            var sql = mysqlConnection.format(middleware.get_account_id_SQL, inserts);
            var hrstart1 = process.hrtime();
            mysqlConnection.query(sql, function(err, rows, fields) {
                var hrend1 = process.hrtime(hrstart1);
                if (!err) {
                    if (rows[0] != null && rows[0].account_id != null) {
                        var inserts = [rows[0].account_id, transaction_type, amount];
                        var sql2 = mysqlConnection.format(middleware.insert_transaction_SQL, inserts);
                        var hrstart2 = process.hrtime();
                        mysqlConnection.query(sql2, function(err, rows, fields) {
                            var hrend2 = process.hrtime(hrstart2); // in ms

                            if (!err) {
                                logger.sql_log(req, INFO_LEVEL, Date(), sql2, rows, err, hrend2[1] / 1000000)
                                resolve('success');
                            } else {
                                logger.sql_log(req, ERROR_LEVEL, Date(), sql2, rows, err, hrend2[1] / 1000000)
                                reject('fail');
                            };
                        });
                    }
                } else {
                    logger.sql_log(req, ERROR_LEVEL, Date(), sql, rows, err, hrend1[1] / 1000000)
                    reject('fail');
                };
            });
        });
    },

    deposit: function(req, res, callback) {
        var account_number = req.body.account_number;
        var amount = parseInt(req.body.amount);
        // get amount
        var inserts = [account_number];
        var getAmountQuery = mysqlConnection.format(middleware.get_balance_SQL, inserts);
        var getbalance_start = process.hrtime();
        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            var getbalance_end = process.hrtime(getbalance_start); // in ms
            if (!err) {
                if (rows[0] != null && rows[0].balance != null) {
                    var currentBalance = parseInt(rows[0].balance);
                    var newBalane = currentBalance + amount;
                    var inserts = [newBalane, account_number];
                    var updateBalanceQuery = mysqlConnection.format(middleware.update_balance_SQL, inserts);
                    var updateBalanceStart = process.hrtime();
                    mysqlConnection.query(updateBalanceQuery, function(err, rows, fields) {
                        var updateBalanceEnd = process.hrtime(updateBalanceStart); // in ms
                        if (!err) {
                            logger.sql_log(req, INFO_LEVEL, Date(), updateBalanceQuery, rows, err, updateBalanceEnd[1] / 1000000);
                            var promise = middleware.addTransaction(req, account_number, 'deposit', amount);
                            promise.then(function() {
                                res.send('YOU HAVE DEPOSIT $' + amount + ' TO ACCOUNT ' + account_number + '. NEW BALANCE IS: $' + newBalane);
                                callback();
                            }, function() {
                                callback();
                                res.send('FAILED TO DEPOSIT $' + amount + ' TO ACCOUNT ' + account_number + '.');
                            });
                        } else {
                            logger.sql_log(req, ERROR_LEVEL, Date(), updateBalanceQuery, rows, err, updateBalanceEnd[1] / 1000000);
                            callback();
                            res.send('FAILED TO DEPOSIT $' + amount + ' TO ACCOUNT ' + account_number + '.');
                        }
                    });
                } else {
                    logger.sql_log(req, WARN_LEVEL, Date(), updateBalanceQuery, rows, err, getbalance_end[1] / 1000000);
                    callback();
                    res.send("NOT SUCH ACCOUNT, PLEASE CHECK YOUR ACCOUNT NUMBER.");
                }
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), getAmountQuery, rows, err, getbalance_end[1] / 1000000);
                if (callback && typeof(callback) === "function") {
                    callback();
                }
                res.send('FAILED TO DEPOSIT $' + amount + ' TO ACCOUNT ' + account_number + '.');
            }
        });
    },
    debit: function(req, res, callback) {
        var account_number = req.body.account_number;
        var amount = parseInt(req.body.amount);
        logger.log(req.user.ip + "wants to debit " + amount + " from account " + account_number);
        // get amount
        var inserts = [account_number];
        getAmountQuery = mysqlConnection.format(middleware.get_balance_SQL, inserts);
        var getbalance_start = process.hrtime();

        mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
            var getbalance_end = process.hrtime(getbalance_start)[1]; // in ms

            if (!err) {
                if (rows[0] != null && rows[0].balance != null) {
                    var currentBalance = parseInt(rows[0].balance);
                    var newBalane = currentBalance - amount;
                    var inserts = [newBalane, account_number];
                    updateBalanceQuery = mysqlConnection.format(middleware.update_balance_SQL, inserts);
                    if (newBalane >= 0) {
                        var updateBalanceStart = process.hrtime();
                        mysqlConnection.query(updateBalanceQuery, function(err, rows, fields) {
                            var updateBalanceEnd = process.hrtime(updateBalanceStart); // in ms
                            if (!err) {
                                logger.sql_log(req, INFO_LEVEL, Date(), updateBalanceQuery, rows, err, updateBalanceEnd[1] / 1000000)
                                var promise = middleware.addTransaction(req, account_number, 'debit', amount);
                                promise.then(function() {
                                    res.send('YOU HAVE DEBITED $' + amount + ' FROM ACCOUNT ' + account_number + '. NEW BALANCE IS: $' + newBalane);
                                    callback();
                                }, function() {
                                    res.send('FAILED TO DEBIT $' + amount + ' FROM ACCOUNT ' + account_number + '.');
                                    callback();
                                })
                            } else {
                                logger.sql_log(req, ERROR_LEVEL, Date(), updateBalanceQuery, rows, err, updateBalanceEnd[1] / 1000000)
                                callback();
                                res.send('FAILED TO DEBIT $' + amount + ' FROM ACCOUNT ' + account_number + '.');
                            }
                        });
                    } else {
                        logger.sql_log(req, WARN_LEVEL, Date(), updateBalanceQuery, rows, { errorMessage: 'INSUFFICIENT FUND IN ACCOUNT ' + account_number }, 0)
                        callback();
                        res.send('INSUFFICIENT FUND IN ACCOUNT ' + account_number);
                    }
                } else {
                    logger.sql_log(req, WARN_LEVEL, Date(), getAmountQuery, rows, { errorMessage: 'NOT SUCH ACCOUNT' }, 0)

                    callback();
                    res.send("NOT SUCH ACCOUNT, PLEASE CHECK YOUR ACCOUNT NUMBER.");
                }
            } else {
                logger.sql_log(req, ERROR_LEVEL, Date(), getAmountQuery, rows, err, getbalance_start[1] / 1000000)
                callback();
                res.send('FAILED TO DEBIT $' + amount + ' FROM ACCOUNT ' + account_number + '.');
            }
        });
    }
}

module.exports = middleware;
