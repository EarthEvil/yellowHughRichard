var LocalStrategy = require('passport-local').Strategy;
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        // body...
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        done({ id: id, name: id });
    });
    passport.use('local-signup', new LocalStrategy() {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            if (username === password) {
                done(null, { id: username, name: username });
            } else {
                done(null, null);
            }
        }
    );
};
