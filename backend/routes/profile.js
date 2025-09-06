const express = require('express');
const mysql = require('mysql2/promise');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Create database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

const profileModel = new Profile(pool);

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

// GET /profile - Get current user's profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`👤 Fetching profile for user ID: ${userId}`);

        const profile = await profileModel.getUserProfile(userId);
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        res.json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error('❌ Error fetching profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch profile'
        });
    }
});

// GET /profile/:userId - Get any user's public profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        console.log(`👤 Fetching public profile for user ID: ${userId}`);

        const profile = await profileModel.getUserProfile(userId);
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        // Remove sensitive information for public view
        delete profile.email;
        delete profile.phone;

        res.json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error('❌ Error fetching public profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch profile'
        });
    }
});

// GET /profile/items - Get current user's listed items
router.get('/profile/items', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        console.log(`📦 Fetching items for user ID: ${userId}`);

        const items = await profileModel.getUserItems(userId, limit, offset);

        res.json({
            success: true,
            data: {
                items,
                pagination: {
                    currentPage: page,
                    totalItems: items.length,
                    hasNextPage: items.length === limit,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching user items:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch items'
        });
    }
});

// GET /profile/:userId/items - Get any user's public items
router.get('/profile/:userId/items', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        console.log(`📦 Fetching public items for user ID: ${userId}`);

        const items = await profileModel.getUserItems(userId, limit, offset);

        res.json({
            success: true,
            data: {
                items,
                pagination: {
                    currentPage: page,
                    totalItems: items.length,
                    hasNextPage: items.length === limit,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching user items:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch items'
        });
    }
});

// GET /profile/orders - Get current user's order history
router.get('/profile/orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        console.log(`🛒 Fetching orders for user ID: ${userId}`);

        const orders = await profileModel.getUserOrders(userId, limit, offset);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: page,
                    totalItems: orders.length,
                    hasNextPage: orders.length === limit,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

// PUT /profile - Update current user's profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, profile_pic } = req.body;

        console.log(`✏️ Updating profile for user ID: ${userId}`);

        await profileModel.updateProfile(userId, { name, phone, profile_pic });

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }
});

// PUT /profile/location - Update current user's location
router.put('/profile/location', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, city, state, postal_code, latitude, longitude } = req.body;

        console.log(`📍 Updating location for user ID: ${userId}`);

        await profileModel.updateLocation(userId, { 
            address, city, state, postal_code, latitude, longitude 
        });

        res.json({
            success: true,
            message: 'Location updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating location:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update location'
        });
    }
});

// Test route
router.get('/test/profile', (req, res) => {
    res.json({
        message: 'Profile routes working!',
        endpoints: {
            'My Profile': 'GET /profile/profile (requires auth)',
            'Public Profile': 'GET /profile/profile/:userId',
            'My Items': 'GET /profile/profile/items (requires auth)',
            'User Items': 'GET /profile/profile/:userId/items',
            'My Orders': 'GET /profile/profile/orders (requires auth)',
            'Update Profile': 'PUT /profile/profile (requires auth)',
            'Update Location': 'PUT /profile/profile/location (requires auth)'
        }
    });
});

module.exports = router;
