const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('mysql2/promise');
const User = require('../models/User');

console.log('🔧 Configuring Google OAuth...');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Found ✅' : 'Missing ❌');
console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Found ✅' : 'Missing ❌');

// Create database connection for user model
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

const userModel = new User(pool);

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Extract user information from Google profile
        const googleUserData = {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            picture: profile.photos[0].value
        };

        console.log('🔍 Checking for existing user:', googleUserData.email);

        // Check if user exists by email
        let existingUser = await userModel.findByEmail(googleUserData.email);
        
        if (existingUser) {
            console.log('✅ Existing user found:', existingUser.email);
            // Update profile with latest Google data
            await userModel.updateProfile(existingUser.id, {
                name: googleUserData.name,
                profilePic: googleUserData.picture
            });
            return done(null, existingUser);
        }

        // Create new user if doesn't exist
        console.log('🆕 Creating new Google user:', googleUserData.email);
        const newUser = await userModel.createGoogleUser({
            email: googleUserData.email,
            name: googleUserData.name,
            profilePic: googleUserData.picture,
            role: 'buyer'
        });
        
        return done(null, newUser);
    } catch (error) {
        console.error('❌ Google OAuth Database Error:', error);
        return done(error, null);
    }
}));

// Serialize user for session (store user ID)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session (get user by ID)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
