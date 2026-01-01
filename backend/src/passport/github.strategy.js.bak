import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"], // Crucial to get the email!
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // GitHub might return multiple emails, we want the primary one
        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          // Handle case where user has no public email on GitHub
          return done(new Error("No email found in GitHub profile"), null);
        }

        // 1. Check if user exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) return done(null, existingUser);

        // 2. Create new user
        const newUser = await User.create({
          fullName: profile.displayName || profile.username, // GitHub uses 'username' often
          email: email,
          password: uuidv4(),
          avatar: profile.photos[0]?.value,
          resumeHistory: [],
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
