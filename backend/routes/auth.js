const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth Login - Start authentication
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback - Handle Google's response and create user in DB
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login-failed' }),
    (req, res) => {
        console.log('✅ Google OAuth Success - User from DB:', req.user);
        
        // Create JWT token with database user data
        const token = jwt.sign(
            {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                picture: req.user.profile_pic,
                role: req.user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log('🔑 JWT Token created for user:', req.user.email);

        // Redirect to frontend landing page with token
        res.redirect(`${process.env.FRONTEND_URL}/landing?token=${token}`);
    }
);

// Logout user
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Get current user info (JWT protected route)
router.get('/user', authenticateToken, (req, res) => {
    res.json({ 
        success: true, 
        user: req.user 
    });
});

// Login failed route
router.get('/login-failed', (req, res) => {
    res.status(401).json({ 
        success: false, 
        message: 'Google authentication failed' 
    });
});

// Test route to check if auth routes are working
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Auth routes working!',
        endpoints: {
            'Google Login': 'GET /auth/google',
            'Google Callback': 'GET /auth/google/callback',
            'Logout': 'GET /auth/logout',
            'User Info': 'GET /auth/user (requires Bearer token)',
            'Login Failed': 'GET /auth/login-failed'
        }
    });
});

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: 'Access token required' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                error: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
}

module.exports = router;