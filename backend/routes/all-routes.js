const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Create database connection to AWS RDS
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

// ===============================
// 🏠 LANDING PAGE ROUTES
// ===============================

// GET /landing-items - Items for landing page
router.get('/landing-items', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                i.id, i.name, i.description, i.price, i.created_at,
                u.name as seller_name, u.profile_pic as seller_pic, u.id as seller_id,
                c.name as category_name, c.id as category_id,
                l.city, l.state, l.address,
                img.image_url as primary_image
            FROM items i
            LEFT JOIN users u ON i.seller_id = u.id
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN locations l ON i.location_id = l.id
            LEFT JOIN item_images img ON i.id = img.item_id AND img.is_primary = 1
            ORDER BY i.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [items] = await pool.execute(query, [limit, offset]);

        res.json({
            success: true,
            data: { items }
        });

    } catch (error) {
        console.error('❌ Error fetching landing items:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch items' });
    }
});

// GET /categories - All categories
router.get('/categories', async (req, res) => {
    try {
        const query = 'SELECT id, name FROM categories ORDER BY name';
        const [categories] = await pool.execute(query);

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
});

// GET /search-items - Search items
router.get('/search-items', async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        if (!searchTerm) {
            return res.status(400).json({ success: false, error: 'Search term required' });
        }

        const query = `
            SELECT 
                i.id, i.name, i.description, i.price, i.created_at,
                u.name as seller_name, u.profile_pic as seller_pic,
                c.name as category_name,
                l.city, l.state,
                img.image_url as primary_image
            FROM items i
            LEFT JOIN users u ON i.seller_id = u.id
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN locations l ON i.location_id = l.id
            LEFT JOIN item_images img ON i.id = img.item_id AND img.is_primary = 1
            WHERE i.name LIKE ? OR i.description LIKE ?
            ORDER BY i.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const likePattern = `%${searchTerm}%`;
        const [items] = await pool.execute(query, [likePattern, likePattern, limit, offset]);

        res.json({
            success: true,
            data: { items, searchTerm }
        });

    } catch (error) {
        console.error('❌ Error searching items:', error);
        res.status(500).json({ success: false, error: 'Failed to search items' });
    }
});

// ===============================
// 👤 PROFILE PAGE ROUTES
// ===============================

// GET /my-profile - Current user's profile
router.get('/my-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT 
                u.id, u.name, u.email, u.role, u.phone, u.profile_pic, u.created_at,
                l.address, l.city, l.state, l.postal_code, l.latitude, l.longitude,
                (SELECT COUNT(*) FROM items WHERE seller_id = u.id) as items_listed,
                (SELECT COUNT(*) FROM orders WHERE buyer_id = u.id) as orders_made,
                (SELECT COUNT(*) FROM reviews WHERE reviewer_id = u.id) as reviews_given,
                (SELECT AVG(r.rating) FROM reviews r JOIN items i ON r.item_id = i.id WHERE i.seller_id = u.id) as avg_rating
            FROM users u
            LEFT JOIN locations l ON u.id = l.user_id
            WHERE u.id = ?
        `;

        const [profile] = await pool.execute(query, [userId]);

        if (profile.length === 0) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        res.json({
            success: true,
            data: profile[0]
        });

    } catch (error) {
        console.error('❌ Error fetching profile:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
});

// GET /user-profile/:userId - Any user's public profile
router.get('/user-profile/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        const query = `
            SELECT 
                u.id, u.name, u.role, u.profile_pic, u.created_at,
                l.city, l.state,
                (SELECT COUNT(*) FROM items WHERE seller_id = u.id) as items_listed,
                (SELECT AVG(r.rating) FROM reviews r JOIN items i ON r.item_id = i.id WHERE i.seller_id = u.id) as avg_rating
            FROM users u
            LEFT JOIN locations l ON u.id = l.user_id
            WHERE u.id = ?
        `;

        const [profile] = await pool.execute(query, [userId]);

        if (profile.length === 0) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        res.json({
            success: true,
            data: profile[0]
        });

    } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
});

// GET /my-items - Current user's items
router.get('/my-items', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                i.id, i.name, i.description, i.price, i.created_at,
                c.name as category_name,
                l.city, l.state,
                img.image_url as primary_image,
                (SELECT AVG(rating) FROM reviews WHERE item_id = i.id) as avg_rating,
                (SELECT COUNT(*) FROM reviews WHERE item_id = i.id) as review_count
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN locations l ON i.location_id = l.id
            LEFT JOIN item_images img ON i.id = img.item_id AND img.is_primary = 1
            WHERE i.seller_id = ?
            ORDER BY i.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [items] = await pool.execute(query, [userId, limit, offset]);

        res.json({
            success: true,
            data: { items }
        });

    } catch (error) {
        console.error('❌ Error fetching user items:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch items' });
    }
});

// GET /my-orders - Current user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                o.id, o.status, o.created_at,
                p.amount as total_amount, p.method as payment_method, p.status as payment_status,
                GROUP_CONCAT(
                    CONCAT(i.name, ' (', oi.quantity, 'x', oi.price, ')')
                    SEPARATOR ', '
                ) as order_items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN items i ON oi.item_id = i.id
            LEFT JOIN payments p ON o.id = p.order_id
            WHERE o.buyer_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [orders] = await pool.execute(query, [userId, limit, offset]);

        res.json({
            success: true,
            data: { orders }
        });

    } catch (error) {
        console.error('❌ Error fetching user orders:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});

// ===============================
// ⭐ REVIEWS PAGE ROUTES
// ===============================

// GET /item-reviews/:itemId - Reviews for specific item
router.get('/item-reviews/:itemId', async (req, res) => {
    try {
        const itemId = parseInt(req.params.itemId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                r.id, r.rating, r.comment, r.created_at,
                u.name as reviewer_name, u.profile_pic as reviewer_pic, u.id as reviewer_id
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.item_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [reviews] = await pool.execute(query, [itemId, limit, offset]);

        res.json({
            success: true,
            data: { reviews }
        });

    } catch (error) {
        console.error('❌ Error fetching item reviews:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

// GET /my-reviews - Current user's given reviews
router.get('/my-reviews', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                r.id, r.rating, r.comment, r.created_at,
                i.name as item_name, i.id as item_id,
                img.image_url as item_image,
                seller.name as seller_name, seller.id as seller_id
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
            data: { reviews }
        });

    } catch (error) {
        console.error('❌ Error fetching user reviews:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

// POST /create-review - Create new review
router.post('/create-review', authenticateToken, async (req, res) => {
    try {
        const { item_id, rating, comment } = req.body;
        const reviewer_id = req.user.id;

        // Check if already reviewed
        const checkQuery = 'SELECT id FROM reviews WHERE item_id = ? AND reviewer_id = ?';
        const [existing] = await pool.execute(checkQuery, [item_id, reviewer_id]);

        if (existing.length > 0) {
            return res.status(400).json({ success: false, error: 'Already reviewed this item' });
        }

        const query = `
            INSERT INTO reviews (item_id, reviewer_id, rating, comment)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [item_id, reviewer_id, rating, comment]);

        res.json({
            success: true,
            data: { id: result.insertId, item_id, rating, comment }
        });

    } catch (error) {
        console.error('❌ Error creating review:', error);
        res.status(500).json({ success: false, error: 'Failed to create review' });
    }
});

// ===============================
// 📊 ADMIN ROUTES (COMPLETE ALL TABLES)
// ===============================

// GET /admin-stats - Admin dashboard stats
router.get('/admin-stats', authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const query = `
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM items) as total_items,
                (SELECT COUNT(*) FROM orders) as total_orders,
                (SELECT COUNT(*) FROM reviews) as total_reviews,
                (SELECT COUNT(*) FROM payments) as total_payments,
                (SELECT COUNT(*) FROM categories) as total_categories,
                (SELECT COUNT(*) FROM locations) as total_locations,
                (SELECT COUNT(*) FROM item_images) as total_images,
                (SELECT COUNT(*) FROM admin_logs) as total_admin_actions,
                (SELECT COUNT(*) FROM users WHERE role = 'seller') as total_sellers,
                (SELECT COUNT(*) FROM users WHERE role = 'buyer') as total_buyers,
                (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins
        `;

        const [stats] = await pool.execute(query);

        res.json({
            success: true,
            data: stats[0]
        });

    } catch (error) {
        console.error('❌ Error fetching admin stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
});

// GET /admin-logs - Admin activity logs
router.get('/admin-logs', authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                al.id, al.action_type, al.target_table, al.target_id, al.description, al.created_at,
                u.name as admin_name, u.email as admin_email
            FROM admin_logs al
            JOIN users u ON al.admin_id = u.id
            ORDER BY al.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [logs] = await pool.execute(query, [limit, offset]);

        res.json({
            success: true,
            data: { logs }
        });

    } catch (error) {
        console.error('❌ Error fetching admin logs:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch admin logs' });
    }
});

// POST /admin-log - Create admin log entry
router.post('/admin-log', authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const { action_type, target_table, target_id, description } = req.body;
        const admin_id = req.user.id;

        const query = `
            INSERT INTO admin_logs (admin_id, action_type, target_table, target_id, description)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [admin_id, action_type, target_table, target_id, description]);

        res.json({
            success: true,
            data: { id: result.insertId, action_type, target_table, target_id, description }
        });

    } catch (error) {
        console.error('❌ Error creating admin log:', error);
        res.status(500).json({ success: false, error: 'Failed to create admin log' });
    }
});

// GET /all-users - Admin view all users
router.get('/all-users', authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                u.id, u.name, u.email, u.role, u.phone, u.created_at,
                l.city, l.state,
                (SELECT COUNT(*) FROM items WHERE seller_id = u.id) as items_count,
                (SELECT COUNT(*) FROM orders WHERE buyer_id = u.id) as orders_count
            FROM users u
            LEFT JOIN locations l ON u.id = l.user_id
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [users] = await pool.execute(query, [limit, offset]);

        res.json({
            success: true,
            data: { users }
        });

    } catch (error) {
        console.error('❌ Error fetching all users:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
});

// ===============================
// 🛍️ SELL ITEM ROUTES
// ===============================

// POST /sell-item - Create new item for sale
router.post('/sell-item', authenticateToken, async (req, res) => {
    try {
        const seller_id = req.user.id;
        const { 
            title, 
            description, 
            price, 
            category_id, 
            condition_type, 
            is_available = true,
            images = [] // Array of image URLs
        } = req.body;

        // Validate required fields
        if (!title || !description || !price || !category_id || !condition_type) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: title, description, price, category_id, condition_type' 
            });
        }

        // Validate seller role
        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                error: 'Only sellers can create items. Please update your profile to seller role.' 
            });
        }

        // Validate category exists
        const [categoryCheck] = await pool.execute(
            'SELECT id FROM categories WHERE id = ?', 
            [category_id]
        );
        
        if (categoryCheck.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid category_id. Category does not exist.' 
            });
        }

        // Insert item into items table
        const itemQuery = `
            INSERT INTO items (
                seller_id, title, description, price, category_id, 
                condition_type, is_available, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const [itemResult] = await pool.execute(itemQuery, [
            seller_id, title, description, price, category_id, 
            condition_type, is_available
        ]);

        const item_id = itemResult.insertId;

        // Insert images if provided
        if (images && images.length > 0) {
            const imageQuery = `
                INSERT INTO item_images (item_id, image_url, is_primary) 
                VALUES (?, ?, ?)
            `;
            
            for (let i = 0; i < images.length; i++) {
                const is_primary = i === 0 ? true : false; // First image is primary
                await pool.execute(imageQuery, [item_id, images[i], is_primary]);
            }
        }

        // Get the complete item with category name
        const [newItem] = await pool.execute(`
            SELECT 
                i.id, i.title, i.description, i.price, i.condition_type, 
                i.is_available, i.created_at,
                c.name as category_name,
                u.name as seller_name,
                (SELECT image_url FROM item_images WHERE item_id = i.id AND is_primary = true) as primary_image
            FROM items i
            JOIN categories c ON i.category_id = c.id
            JOIN users u ON i.seller_id = u.id
            WHERE i.id = ?
        `, [item_id]);

        res.status(201).json({
            success: true,
            message: 'Item created successfully!',
            data: {
                item: newItem[0],
                images_uploaded: images.length
            }
        });

    } catch (error) {
        console.error('❌ Error creating item:', error);
        res.status(500).json({ success: false, error: 'Failed to create item' });
    }
});

// PUT /update-item/:itemId - Update existing item
router.put('/update-item/:itemId', authenticateToken, async (req, res) => {
    try {
        const item_id = req.params.itemId;
        const seller_id = req.user.id;
        const { 
            title, 
            description, 
            price, 
            category_id, 
            condition_type, 
            is_available 
        } = req.body;

        // Check if item exists and belongs to user
        const [itemCheck] = await pool.execute(
            'SELECT seller_id FROM items WHERE id = ?', 
            [item_id]
        );
        
        if (itemCheck.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Item not found' 
            });
        }

        if (itemCheck[0].seller_id !== seller_id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                error: 'You can only update your own items' 
            });
        }

        // Update item
        const updateQuery = `
            UPDATE items SET 
                title = COALESCE(?, title),
                description = COALESCE(?, description),
                price = COALESCE(?, price),
                category_id = COALESCE(?, category_id),
                condition_type = COALESCE(?, condition_type),
                is_available = COALESCE(?, is_available),
                updated_at = NOW()
            WHERE id = ?
        `;

        await pool.execute(updateQuery, [
            title, description, price, category_id, 
            condition_type, is_available, item_id
        ]);

        // Get updated item
        const [updatedItem] = await pool.execute(`
            SELECT 
                i.id, i.title, i.description, i.price, i.condition_type, 
                i.is_available, i.created_at, i.updated_at,
                c.name as category_name,
                u.name as seller_name
            FROM items i
            JOIN categories c ON i.category_id = c.id
            JOIN users u ON i.seller_id = u.id
            WHERE i.id = ?
        `, [item_id]);

        res.json({
            success: true,
            message: 'Item updated successfully!',
            data: { item: updatedItem[0] }
        });

    } catch (error) {
        console.error('❌ Error updating item:', error);
        res.status(500).json({ success: false, error: 'Failed to update item' });
    }
});

// DELETE /delete-item/:itemId - Delete item
router.delete('/delete-item/:itemId', authenticateToken, async (req, res) => {
    try {
        const item_id = req.params.itemId;
        const seller_id = req.user.id;

        // Check if item exists and belongs to user
        const [itemCheck] = await pool.execute(
            'SELECT seller_id, title FROM items WHERE id = ?', 
            [item_id]
        );
        
        if (itemCheck.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Item not found' 
            });
        }

        if (itemCheck[0].seller_id !== seller_id && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                error: 'You can only delete your own items' 
            });
        }

        // Delete item images first (foreign key constraint)
        await pool.execute('DELETE FROM item_images WHERE item_id = ?', [item_id]);
        
        // Delete item
        await pool.execute('DELETE FROM items WHERE id = ?', [item_id]);

        res.json({
            success: true,
            message: `Item "${itemCheck[0].title}" deleted successfully!`
        });

    } catch (error) {
        console.error('❌ Error deleting item:', error);
        res.status(500).json({ success: false, error: 'Failed to delete item' });
    }
});

module.exports = router;
