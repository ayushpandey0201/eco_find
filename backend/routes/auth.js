const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth Login
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {
        // Create JWT token
        const token = jwt.sign(
            {
                id: req.user.googleId,
                email: req.user.email,
                name: req.user.name,
                picture: req.user.picture
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log('✅ Google OAuth Success - Redirecting to frontend');

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: req.user.googleId,
            email: req.user.email,
            name: req.user.name,
            picture: req.user.picture
        }))}`);
    }
);

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ success: false, error: 'Logout failed' });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Get current user info (JWT protected)
router.get('/user', authenticateToken, (req, res) => {
    res.json({ success: true, user: req.user });
});

// Login failed
router.get('/login-failed', (req, res) => {
    res.status(401).json({ success: false, message: 'Google authentication failed' });
});

// JWT middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Access token required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

module.exports = router;
