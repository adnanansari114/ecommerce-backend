// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');

// module.exports = function(passportInstance) {
//   passportInstance.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL,
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       // profile.emails[0].value should be available
//       const email = profile.emails && profile.emails[0] && profile.emails[0].value;
//       const name = profile.displayName || (profile.name && `${profile.name.givenName} ${profile.name.familyName}`) || 'No Name';

//       if (!email) {
//         return done(new Error('No email available from Google'), null);
//       }

//       // Find user
//       let user = await User.findOne({ email });

//       if (!user) {
//         // Create a new user (mark agreed true and set random password)
//         const randomPass = Math.random().toString(36).slice(-12);
//         const hash = await bcrypt.hash(randomPass, 10);
//         // generate unique username from email prefix if possible
//         const usernameBase = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();
//         let username = usernameBase;
//         let i = 0;
//         while (await User.findOne({ username })) {
//           i++;
//           username = `${usernameBase}${i}`;
//         }

//         user = await User.create({
//           name,
//           username,
//           email,
//           phone: '',
//           password: hash,
//           agreed: true,
//           // you can also save profile photo from profile.photos[0].value if available
//           profilePhoto: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined
//         });
//       }

//       // Done -> pass user to next step
//       return done(null, user);
//     } catch (err) {
//       return done(err, null);
//     }
//   }));
// };
