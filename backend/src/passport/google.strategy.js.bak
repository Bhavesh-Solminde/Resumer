import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid"; // Generates a random secure password
import ENV from "../env.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        // 2. If not, create new user
        const newUser = await User.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          password: uuidv4(), // We must set a password, so we make a random complex one
          avatar: profile.photos[0]?.value, // Google returns an avatar URL
          resumeHistory: [],
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
