// Backend/config/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Organization, sequelize } = require('../models');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Log the profile data from Google to see what you get
        console.log('✅ Google Profile Data:', profile);

        // 1. Check if user already exists with this Google ID
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          console.log('💡 User found by Google ID. Logging in.');
          // ✅ CRITICAL: Tell Passport the user was found
          return done(null, user);
        }

        // 2. No user with that Google ID. Check if their email is already in use.
        const userEmail = profile.emails[0].value;
        user = await User.findOne({ where: { email: userEmail } });

        if (user) {
          console.log('💡 User found by email. Linking Google ID and logging in.');
          // User registered normally, now link their Google account
          user.googleId = profile.id;
          await user.save();
          // ✅ CRITICAL: Tell Passport the user was found and updated
          return done(null, user);
        }

        // 3. No user found at all. Create a brand new user.
        console.log('💡 No user found. Creating a new user.');
        const t = await sequelize.transaction();
        try {
          // Create a unique username from their Google name
          let newUsername = profile.displayName.replace(/\s+/g, '');
          const existingUsername = await User.findOne({ where: { username: newUsername } });
          if (existingUsername) {
            newUsername = `${newUsername}${profile.id.slice(-5)}`;
          }

          // Create the user
          const newUser = await User.create({
            googleId: profile.id,
            email: userEmail,
            username: newUsername,
          }, { transaction: t });

          // Create their default organization
          await Organization.create({
            name: `${newUser.username}'s Organization`,
            adminId: newUser.id,
          }, { transaction: t });

          await t.commit();
          console.log('✅ New user and organization created successfully.');
          // ✅ CRITICAL: Tell Passport the new user was created
          return done(null, newUser);
          
        } catch (transactionError) {
          if (t) await t.rollback();
          console.error('❌ Error during new user transaction:', transactionError);
          // ✅ CRITICAL: Tell Passport an error occurred
          return done(transactionError, false);
        }

      } catch (err) {
        console.error('❌ Top-level error in Passport strategy:', err);
        // ✅ CRITICAL: Tell Passport a fatal error occurred
        return done(err, false);
      }
    }
  )
);