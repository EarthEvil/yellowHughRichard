var LocalStrategy = require('passport-local').Strategy;
var mysqlConnection = require(__dirname + '/database.js');
var bcrypt = require('bcryptjs');
var logger = require(__dirname + '/logger.js')

module.exports = function(passport) {

    function checkIsSame(string1, string2, done) {
        logger.info("string1: " + string1);
        logger.info("string2: " + string2);
        if (string1 === string2) {
            logger.info("correct password");
            done(null, { id: "username", password: string2 });
        } else {
            logger.warn("incorrect password");

            done(null, null);

        }
    }

    function checkPassword(username, password, callback, done) {
        //user prepared query
        var sql = 'select salt, hash from user where username = ?;';
        var inserts = [username];
        sql = mysqlConnection.format(sql, inserts);
        logger.info("checkPassword sql: " + sql);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                if (rows[0] != null && rows[0].hash != null) {
                    if (bcrypt.compareSync(password, rows[0].hash)) {
                        logger.info("correct password");
                        done(null, { id: username });
                    } else {
                        logger.warn("incorrect password");
                        done(null, null);
                    }
                } else {
                    logger.warn("incorrect password");
                    done(null, false);
                }
            } else {
                logger.error("query error");

                done(null, null);
            }
        });
    };

    function checkUser(req, username, password, callback, done) {
        //user prepared query
        var sql = 'select username from user where username = ?;';
        var inserts = [username];
        sql = mysqlConnection.format(sql, inserts);
        logger.info("checkUser sql: " + sql);

        mysqlConnection.query(sql, function(err, rows, fields, req) {
            if (!err) {
                if (rows[0] != null) {
                    logger.warn("user already exist");
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

                } else {
                    logger.warn("user does not exist");

                    if (typeof callback === 'function') {
                        callback(username, password, done);
                        return done(null, { id: username });

                    } else {
                        logger.error("callback is not a function");
                    }
                }
            } else {
                logger.error("query error");
                return done(null, null);
            }
        });
    }

    function addUser(username, password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        var sql = 'insert into user (username, salt,hash) values (?,?,?)';
        var inserts = [username, salt, hash];
        sql = mysqlConnection.format(sql, inserts);
        logger.info("addUser sql: " + sql);

        mysqlConnection.query(sql,
            function(err, rows, fields) {
                if (!err) {
                    logger.info("add user to database: " + username + "\t" + salt + "\t" + hash);
                } else {
                    logger.error("qurey error");
                }
            });
    }

    passport.serializeUser(function(user, done) {
        // body...
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        done(null, { id: id });
    });
    passport.use('local-signin', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            checkPassword(username, password, checkIsSame, done);
        }));


    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            checkUser(req, username, password, addUser, done);
        }));
};
