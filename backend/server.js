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

// Authentication Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// All App Routes (Landing, Profile, Reviews)
const allRoutes = require('./routes/all-routes');
app.use('/api', allRoutes);

// Redirect /login to /auth/google for convenience
app.get('/login', (req, res) => {
    res.redirect('/auth/google');
});



// Basic server check
app.get('/', (req, res) => {
    res.json({
        message: 'EcoFinds Backend API running!',
        endpoints: {
            // Authentication
            login: 'GET /login',
            callback: 'GET /auth/google/callback',
            logout: 'GET /auth/logout',
            user: 'GET /auth/user (requires Bearer token)',
            
            // Landing Page
            landingItems: 'GET /api/landing-items',
            categories: 'GET /api/categories',
            searchItems: 'GET /api/search-items?q=term',
            
            // Profile Page
            myProfile: 'GET /api/my-profile (requires auth)',
            userProfile: 'GET /api/user-profile/:userId',
            myItems: 'GET /api/my-items (requires auth)',
            myOrders: 'GET /api/my-orders (requires auth)',
            
            // Reviews Page
            itemReviews: 'GET /api/item-reviews/:itemId',
            myReviews: 'GET /api/my-reviews (requires auth)',
            createReview: 'POST /api/create-review (requires auth)',
            
            // Sell Item Page
            sellItem: 'POST /api/sell-item (requires seller auth)',
            updateItem: 'PUT /api/update-item/:itemId (requires auth)',
            deleteItem: 'DELETE /api/delete-item/:itemId (requires auth)',
            
            // Admin (Bonus)
            adminStats: 'GET /api/admin-stats (requires admin auth)',
            adminLogs: 'GET /api/admin-logs (requires admin auth)',
            createAdminLog: 'POST /api/admin-log (requires admin auth)',
            allUsers: 'GET /api/all-users (requires admin auth)'
        }
    });
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
