var LocalStrategy = require('passport-local').Strategy;
var mysqlConnection = require(__dirname + '/database.js')
var bcrypt = require('bcryptjs');

module.exports = function(passport) {

    function checkIsSame(string1, string2, done) {
        console.log("string1: " + string1);
        console.log("string2: " + string2);
        if (string1 === string2) {
            console.log("correct password");
            done(null, { id: "username", password: string2 });
        } else {
            console.log("incorrect password");

            done(null, null);

        }
    }

    function checkPassword(username, password, callback, done) {
        //user prepared query
        var sql = 'select salt, hash from user where username = ?;';
        var inserts = [username];
        sql = mysqlConnection.format(sql, inserts);
        console.log("checkPassword sql: " + sql);
        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                if (rows[0].hash != null) {
                    if (bcrypt.compareSync(password, rows[0].hash)) {
                        console.log("correct password");
                        done(null, { id: username });
                    } else {
                        console.log("incorrect password");
                        done(null, false);
                    }
                } else {
                    console.log("incorrect password");
                    done(null, false);
                }
            } else {
                console.log("query error");

                done(null, null);
            }
        });
    };

    function checkUser(username, password, callback, done) {
        //user prepared query
        var sql = 'select username from user where username = ?;';
        var inserts = [username];
        sql = mysqlConnection.format(sql, inserts);
        console.log("checkUser sql: " + sql);

        mysqlConnection.query(sql, function(err, rows, fields) {
            if (!err) {
                if (rows[0] != null) {
                    console.log("user already exist");
                    done(null, null);

                } else {
                    console.log("user does not exist");

                    if (typeof callback === 'function') {
                        callback(username, password, done);
                        done(null, { id: username });

                    } else {
                        console.log("callback is not a function");
                    }
                }
            } else {
                done(null, null);
            }
        });
    }

    function addUser(username, password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        var sql = 'insert into user (username, salt,hash) values (?,?,?)';
        var inserts = [username, salt, hash];
        sql = mysqlConnection.format(sql, inserts);
        console.log("addUser sql: " + sql);

        mysqlConnection.query(sql,
            function(err, rows, fields) {
                if (!err) {
                    console.log("add user to database: " + username + "\t" + salt + "\t" + hash);
                } else {
                    console.log("qurey error");
                }
            });
    }



    passport.serializeUser(function(user, done) {
        // body...
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        done({ id: id, name: id });
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
            checkUser(username, password, addUser, done);
        }));
};
