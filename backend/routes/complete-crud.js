// complete-crud.js - Full CRUD operations for all tables
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access token required' });
    }

    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// ===============================
// 1️⃣ USERS TABLE CRUD
// ===============================

// GET /users - Get all users (admin only)
router.get('/users', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const query = `
            SELECT id, name, email, role, phone, profile_pic, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `;

        const [users] = await pool.execute(query, [limit, offset]);
        
        // Get total count
        const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM users');
        const total = countResult[0].total;

        res.json({
            success: true,
            data: { 
                users, 
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        });
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
});

// GET /users/:id - Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const query = `
            SELECT u.id, u.name, u.email, u.role, u.phone, u.profile_pic, u.created_at,
                   l.address, l.state, l.city, l.postal_code
            FROM users u
            LEFT JOIN locations l ON u.id = l.user_id
            WHERE u.id = ?
        `;

        const [users] = await pool.execute(query, [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: { user: users[0] } });
    } catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
});

// POST /users - Create new user (admin only)
router.post('/users', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const { name, email, password, role = 'buyer', phone, profile_pic } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name, email, and password are required' 
            });
        }

        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 12);

        const query = `
            INSERT INTO users (name, email, password, role, phone, profile_pic)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [name, email, hashedPassword, role, phone, profile_pic]);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { id: result.insertId, name, email, role }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }
        console.error('❌ Error creating user:', error);
        res.status(500).json({ success: false, error: 'Failed to create user' });
    }
});

// PUT /users/:id - Update user
router.put('/users/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, phone, profile_pic, role } = req.body;

        // Users can only update their own profile, admins can update any
        if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'You can only update your own profile' });
        }

        // Only admins can change roles
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Only admins can change user roles' });
        }

        const query = `
            UPDATE users SET 
                name = COALESCE(?, name),
                phone = COALESCE(?, phone),
                profile_pic = COALESCE(?, profile_pic),
                role = COALESCE(?, role)
            WHERE id = ?
        `;

        await pool.execute(query, [name, phone, profile_pic, role, userId]);

        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ success: false, error: 'Failed to update user' });
    }
});

// DELETE /users/:id - Delete user (admin only)
router.delete('/users/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const userId = req.params.id;
        
        // Check if user exists
        const [users] = await pool.execute('SELECT name FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ 
            success: true, 
            message: `User "${users[0].name}" deleted successfully` 
        });
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
});

// ===============================
// 2️⃣ CATEGORIES TABLE CRUD
// ===============================

// GET /categories - Get all categories
router.get('/categories', async (req, res) => {
    try {
        const query = `
            SELECT c.id, c.name,
                   COUNT(i.id) as item_count
            FROM categories c
            LEFT JOIN items i ON c.id = i.category_id
            GROUP BY c.id, c.name
            ORDER BY c.name
        `;

        const [categories] = await pool.execute(query);
        res.json({ success: true, data: { categories } });
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
});

// GET /categories/:id - Get category by ID
router.get('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const query = `
            SELECT c.id, c.name,
                   COUNT(i.id) as item_count
            FROM categories c
            LEFT JOIN items i ON c.id = i.category_id
            WHERE c.id = ?
            GROUP BY c.id, c.name
        `;

        const [categories] = await pool.execute(query, [categoryId]);
        
        if (categories.length === 0) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        res.json({ success: true, data: { category: categories[0] } });
    } catch (error) {
        console.error('❌ Error fetching category:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch category' });
    }
});

// POST /categories - Create new category (admin only)
router.post('/categories', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Category name is required' });
        }

        const query = 'INSERT INTO categories (name) VALUES (?)';
        const [result] = await pool.execute(query, [name]);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { id: result.insertId, name }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, error: 'Category name already exists' });
        }
        console.error('❌ Error creating category:', error);
        res.status(500).json({ success: false, error: 'Failed to create category' });
    }
});

// PUT /categories/:id - Update category (admin only)
router.put('/categories/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const categoryId = req.params.id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Category name is required' });
        }

        await pool.execute('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId]);

        res.json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
        console.error('❌ Error updating category:', error);
        res.status(500).json({ success: false, error: 'Failed to update category' });
    }
});

// DELETE /categories/:id - Delete category (admin only)
router.delete('/categories/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const categoryId = req.params.id;
        
        // Check if category exists
        const [categories] = await pool.execute('SELECT name FROM categories WHERE id = ?', [categoryId]);
        if (categories.length === 0) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        await pool.execute('DELETE FROM categories WHERE id = ?', [categoryId]);

        res.json({ 
            success: true, 
            message: `Category "${categories[0].name}" deleted successfully` 
        });
    } catch (error) {
        console.error('❌ Error deleting category:', error);
        res.status(500).json({ success: false, error: 'Failed to delete category' });
    }
});

// ===============================
// 3️⃣ LOCATIONS TABLE CRUD
// ===============================

// GET /locations - Get all locations (admin only)
router.get('/locations', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const query = `
            SELECT l.*, u.name as user_name, u.email as user_email
            FROM locations l
            JOIN users u ON l.user_id = u.id
            ORDER BY l.created_at DESC
        `;

        const [locations] = await pool.execute(query);
        res.json({ success: true, data: { locations } });
    } catch (error) {
        console.error('❌ Error fetching locations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch locations' });
    }
});

// GET /locations/user/:userId - Get user's location
router.get('/locations/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const query = 'SELECT * FROM locations WHERE user_id = ?';

        const [locations] = await pool.execute(query, [userId]);
        
        if (locations.length === 0) {
            return res.status(404).json({ success: false, error: 'Location not found for this user' });
        }

        res.json({ success: true, data: { location: locations[0] } });
    } catch (error) {
        console.error('❌ Error fetching location:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch location' });
    }
});

// POST /locations - Create/Update user location
router.post('/locations', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { address, state, city, postal_code, latitude, longitude } = req.body;

        if (!address || !city || !state) {
            return res.status(400).json({ 
                success: false, 
                error: 'Address, city, and state are required' 
            });
        }

        // Check if location already exists for user
        const [existing] = await pool.execute('SELECT id FROM locations WHERE user_id = ?', [user_id]);

        if (existing.length > 0) {
            // Update existing location
            const query = `
                UPDATE locations SET 
                    address = ?, state = ?, city = ?, postal_code = ?, 
                    latitude = ?, longitude = ?
                WHERE user_id = ?
            `;
            await pool.execute(query, [address, state, city, postal_code, latitude, longitude, user_id]);
            
            res.json({ success: true, message: 'Location updated successfully' });
        } else {
            // Create new location
            const query = `
                INSERT INTO locations (user_id, address, state, city, postal_code, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.execute(query, [user_id, address, state, city, postal_code, latitude, longitude]);
            
            res.status(201).json({
                success: true,
                message: 'Location created successfully',
                data: { id: result.insertId }
            });
        }
    } catch (error) {
        console.error('❌ Error creating/updating location:', error);
        res.status(500).json({ success: false, error: 'Failed to create/update location' });
    }
});

// DELETE /locations/:id - Delete location
router.delete('/locations/:id', authenticateToken, async (req, res) => {
    try {
        const locationId = req.params.id;
        
        // Check if location belongs to user or user is admin
        const [locations] = await pool.execute('SELECT user_id FROM locations WHERE id = ?', [locationId]);
        if (locations.length === 0) {
            return res.status(404).json({ success: false, error: 'Location not found' });
        }

        if (locations[0].user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'You can only delete your own location' });
        }

        await pool.execute('DELETE FROM locations WHERE id = ?', [locationId]);

        res.json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting location:', error);
        res.status(500).json({ success: false, error: 'Failed to delete location' });
    }
});

// ===============================
// 4️⃣ ITEMS TABLE CRUD
// ===============================

// GET /items - Get all items with filters
router.get('/items', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { category_id, search, min_price, max_price, seller_id } = req.query;

        let whereClause = 'WHERE 1=1';
        let queryParams = [];

        if (category_id) {
            whereClause += ' AND i.category_id = ?';
            queryParams.push(category_id);
        }

        if (search) {
            whereClause += ' AND (i.name LIKE ? OR i.description LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (min_price) {
            whereClause += ' AND i.price >= ?';
            queryParams.push(min_price);
        }

        if (max_price) {
            whereClause += ' AND i.price <= ?';
            queryParams.push(max_price);
        }

        if (seller_id) {
            whereClause += ' AND i.seller_id = ?';
            queryParams.push(seller_id);
        }

        const query = `
            SELECT 
                i.id, i.name, i.description, i.price, i.created_at,
                c.name as category_name,
                u.name as seller_name,
                l.city, l.state,
                (SELECT image_url FROM item_images WHERE item_id = i.id AND is_primary = 1 LIMIT 1) as primary_image
            FROM items i
            JOIN categories c ON i.category_id = c.id
            JOIN users u ON i.seller_id = u.id
            LEFT JOIN locations l ON i.location_id = l.id
            ${whereClause}
            ORDER BY i.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [items] = await pool.execute(query, [...queryParams, limit, offset]);

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM items i 
            ${whereClause}
        `;
        const [countResult] = await pool.execute(countQuery, queryParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            data: { 
                items, 
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        });
    } catch (error) {
        console.error('❌ Error fetching items:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch items' });
    }
});

// GET /items/:id - Get item by ID
router.get('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const query = `
            SELECT 
                i.id, i.name, i.description, i.price, i.created_at,
                c.name as category_name,
                u.id as seller_id, u.name as seller_name, u.email as seller_email,
                l.address, l.city, l.state, l.postal_code
            FROM items i
            JOIN categories c ON i.category_id = c.id
            JOIN users u ON i.seller_id = u.id
            LEFT JOIN locations l ON i.location_id = l.id
            WHERE i.id = ?
        `;

        const [items] = await pool.execute(query, [itemId]);
        
        if (items.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        // Get item images
        const [images] = await pool.execute(
            'SELECT image_url, is_primary FROM item_images WHERE item_id = ? ORDER BY is_primary DESC',
            [itemId]
        );

        res.json({ 
            success: true, 
            data: { 
                item: items[0],
                images: images
            } 
        });
    } catch (error) {
        console.error('❌ Error fetching item:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch item' });
    }
});

// POST /items - Create new item
router.post('/items', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                error: 'Only sellers can create items' 
            });
        }

        const { name, description, price, category_id, location_id, images = [] } = req.body;
        const seller_id = req.user.id;

        if (!name || !description || !price || !category_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name, description, price, and category_id are required' 
            });
        }

        // If location_id not provided, get user's location
        let finalLocationId = location_id;
        if (!finalLocationId) {
            const [userLocation] = await pool.execute('SELECT id FROM locations WHERE user_id = ?', [seller_id]);
            if (userLocation.length > 0) {
                finalLocationId = userLocation[0].id;
            }
        }

        const query = `
            INSERT INTO items (name, description, price, category_id, seller_id, location_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [name, description, price, category_id, seller_id, finalLocationId]);
        const item_id = result.insertId;

        // Insert images if provided
        if (images && images.length > 0) {
            const imageQuery = 'INSERT INTO item_images (item_id, image_url, is_primary) VALUES (?, ?, ?)';
            
            for (let i = 0; i < images.length; i++) {
                const is_primary = i === 0 ? 1 : 0;
                await pool.execute(imageQuery, [item_id, images[i], is_primary]);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: { id: item_id, name, price }
        });
    } catch (error) {
        console.error('❌ Error creating item:', error);
        res.status(500).json({ success: false, error: 'Failed to create item' });
    }
});

// PUT /items/:id - Update item
router.put('/items/:id', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, description, price, category_id } = req.body;

        // Check if item belongs to user or user is admin
        const [items] = await pool.execute('SELECT seller_id FROM items WHERE id = ?', [itemId]);
        if (items.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        if (items[0].seller_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'You can only update your own items' });
        }

        const query = `
            UPDATE items SET 
                name = COALESCE(?, name),
                description = COALESCE(?, description),
                price = COALESCE(?, price),
                category_id = COALESCE(?, category_id)
            WHERE id = ?
        `;

        await pool.execute(query, [name, description, price, category_id, itemId]);

        res.json({ success: true, message: 'Item updated successfully' });
    } catch (error) {
        console.error('❌ Error updating item:', error);
        res.status(500).json({ success: false, error: 'Failed to update item' });
    }
});

// DELETE /items/:id - Delete item
router.delete('/items/:id', authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;

        // Check if item belongs to user or user is admin
        const [items] = await pool.execute('SELECT seller_id, name FROM items WHERE id = ?', [itemId]);
        if (items.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        if (items[0].seller_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'You can only delete your own items' });
        }

        await pool.execute('DELETE FROM items WHERE id = ?', [itemId]);

        res.json({ 
            success: true, 
            message: `Item "${items[0].name}" deleted successfully` 
        });
    } catch (error) {
        console.error('❌ Error deleting item:', error);
        res.status(500).json({ success: false, error: 'Failed to delete item' });
    }
});

module.exports = router;
