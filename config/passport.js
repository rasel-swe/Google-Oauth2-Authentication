const passport = require("passport");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
require('dotenv').config()

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:5000/auth/google/callback",
   
  },
  function(request, accessToken, refreshToken, profile, done) {
   
    User.findOne({googleId: profile.id}, (err, user) => {
        if (err) {
            return done(err);
        }
        done(null, user);

        if(!user){
            let newUser = new User({
                googleId: profile.id,
                username:profile.displayName,
            })
            newUser.save();
            return done(null, newUser);
        }

        else{
            return done(null, newUser);
        }
    })
  }
));

//serial Users
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//deserialize

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
