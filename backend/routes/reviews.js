const express = require('express');
const mysql = require('mysql2/promise');
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

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// GET /item/:itemId/reviews - Get all reviews for an item
router.get('/item/:itemId/reviews', async (req, res) => {
    try {
        const itemId = parseInt(req.params.itemId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        console.log(`⭐ Fetching reviews for item ID: ${itemId}`);

        const query = `
            SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                u.name as reviewer_name,
                u.profile_pic as reviewer_pic,
                u.id as reviewer_id
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.item_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [reviews] = await pool.execute(query, [itemId, limit, offset]);

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalItems: reviews.length,
                    hasNextPage: reviews.length === limit,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching item reviews:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reviews'
        });
    }
});

// GET /item/:itemId/review-stats - Get review statistics for an item
router.get('/item/:itemId/review-stats', async (req, res) => {
    try {
        const itemId = parseInt(req.params.itemId);

        const query = `
            SELECT 
                COUNT(*) as total_reviews,
                AVG(rating) as average_rating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            FROM reviews 
            WHERE item_id = ?
        `;

        const [stats] = await pool.execute(query, [itemId]);

        res.json({
            success: true,
            data: stats[0]
        });

    } catch (error) {
        console.error('❌ Error fetching review stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch review statistics'
        });
    }
});

// GET /user/:userId/reviews-given - Get reviews given by a user
router.get('/user/:userId/reviews-given', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                i.name as item_name,
                i.id as item_id,
                img.image_url as item_image,
                seller.name as seller_name,
                seller.id as seller_id
            FROM reviews r
            JOIN items i ON r.item_id = i.id
            JOIN users seller ON i.seller_id = seller.id
            LEFT JOIN item_images img ON i.id = img.item_id AND img.is_primary = 1
            WHERE r.reviewer_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [reviews] = await pool.execute(query, [userId, limit, offset]);

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalItems: reviews.length,
                    hasNextPage: reviews.length === limit,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user reviews'
        });
    }
});

// GET /seller/:sellerId/reviews-received - Get reviews received by a seller
router.get('/seller/:sellerId/reviews-received', async (req, res) => {
    try {
        const sellerId = parseInt(req.params.sellerId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                i.name as item_name,
                i.id as item_id,
                img.image_url as item_image,
                reviewer.name as reviewer_name,
                reviewer.profile_pic as reviewer_pic,
                reviewer.id as reviewer_id
            FROM reviews r
            JOIN items i ON r.item_id = i.id
            JOIN users reviewer ON r.reviewer_id = reviewer.id
            LEFT JOIN item_images img ON i.id = img.item_id AND img.is_primary = 1
            WHERE i.seller_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [reviews] = await pool.execute(query, [sellerId, limit, offset]);

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: page,
                    totalItems: reviews.length,
                    hasNextPage: reviews.length === limit,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching seller reviews:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch seller reviews'
        });
    }
});

// POST /review - Create a new review
router.post('/review', authenticateToken, async (req, res) => {
    try {
        const { item_id, rating, comment } = req.body;
        const reviewer_id = req.user.id;

        // Check if user already reviewed this item
        const checkQuery = 'SELECT id FROM reviews WHERE item_id = ? AND reviewer_id = ?';
        const [existing] = await pool.execute(checkQuery, [item_id, reviewer_id]);

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'You have already reviewed this item'
            });
        }

        const query = `
            INSERT INTO reviews (item_id, reviewer_id, rating, comment)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [item_id, reviewer_id, rating, comment]);

        console.log('✅ Review created:', result.insertId);

        res.json({
            success: true,
            data: {
                id: result.insertId,
                item_id,
                reviewer_id,
                rating,
                comment,
                created_at: new Date()
            }
        });

    } catch (error) {
        console.error('❌ Error creating review:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create review'
        });
    }
});

// PUT /review/:reviewId - Update a review
router.put('/review/:reviewId', authenticateToken, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId);
        const userId = req.user.id;
        const { rating, comment } = req.body;

        // Check if review belongs to user
        const checkQuery = 'SELECT id FROM reviews WHERE id = ? AND reviewer_id = ?';
        const [existing] = await pool.execute(checkQuery, [reviewId, userId]);

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Review not found or not authorized'
            });
        }

        const query = `
            UPDATE reviews 
            SET rating = ?, comment = ?
            WHERE id = ? AND reviewer_id = ?
        `;

        await pool.execute(query, [rating, comment, reviewId, userId]);

        console.log('✅ Review updated:', reviewId);

        res.json({
            success: true,
            message: 'Review updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating review:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update review'
        });
    }
});

// DELETE /review/:reviewId - Delete a review
router.delete('/review/:reviewId', authenticateToken, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId);
        const userId = req.user.id;

        // Check if review belongs to user
        const checkQuery = 'SELECT id FROM reviews WHERE id = ? AND reviewer_id = ?';
        const [existing] = await pool.execute(checkQuery, [reviewId, userId]);

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Review not found or not authorized'
            });
        }

        const query = 'DELETE FROM reviews WHERE id = ? AND reviewer_id = ?';
        await pool.execute(query, [reviewId, userId]);

        console.log('✅ Review deleted:', reviewId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting review:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete review'
        });
    }
});

module.exports = router;
