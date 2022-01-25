const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/User");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK,
        },
        (accessToken, refreshToken, profile, cb) => {
            User.findOne({ googleId: profile.id }, (err, user) => {
                if (err) return cb(err);
                if (user) {
                    return cb(null, user);
                } else {
                    const newUser = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                    });
                    newUser.save(function (err) {
                        if (err) return cb(err);
                        return cb(null, newUser);
                    });
                }
            });
        }
    )
);

// set up session for new logged in user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});