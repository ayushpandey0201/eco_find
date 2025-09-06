const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

console.log('🔧 Configuring Google OAuth...');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Found ✅' : 'Missing ❌');
console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Found ✅' : 'Missing ❌');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Extract user information from Google profile
        const user = {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            picture: profile.photos[0].value
        };

        console.log('✅ Google OAuth User:', user.name, user.email);
        
        // TODO: Save user to database here
        // For now, just return the user data
        return done(null, user);
    } catch (error) {
        console.error('❌ Google OAuth Error:', error);
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
