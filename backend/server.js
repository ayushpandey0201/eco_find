// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// MySQL Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Test DB connection
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log('✅ Connected to MySQL database!');
        conn.release();
    } catch (err) {
        console.error('❌ DB connection error:', err);
    }
})();

// Google OAuth Login
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
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

        // Redirect to frontend LandingPage with token
        res.redirect(`${process.env.FRONTEND_URL}/landing?token=${token}`);
    }
);


// Logout
app.get('/auth/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ success: false, error: 'Logout failed' });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Get current user info (JWT protected)
app.get('/auth/user', authenticateToken, (req, res) => {
    res.json({ success: true, user: req.user });
});

// Login failed
app.get('/login-failed', (req, res) => {
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

// Basic server check
app.get('/', (req, res) => {
    res.json({
        message: 'EcoFinds Backend API running!',
        endpoints: {
            login: 'GET /login',
            callback: 'GET /auth/google/callback',
            logout: 'GET /auth/logout',
            user: 'GET /auth/user (requires Bearer token)'
        }
    });
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
