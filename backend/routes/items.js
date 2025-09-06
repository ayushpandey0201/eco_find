const express = require('express');
const mysql = require('mysql2/promise');
const Item = require('../models/Item');
const router = express.Router();

// Create database connection for item model
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

const itemModel = new Item(pool);

// GET /landing-item-list - Items for landing page
router.get('/landing-item-list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        console.log(`📋 Fetching items for landing page - Page: ${page}, Limit: ${limit}`);

        // Get items and total count
        const [items, totalCount] = await Promise.all([
            itemModel.getLandingPageItems(limit, offset),
            itemModel.getTotalItemsCount()
        ]);

        console.log(`✅ Found ${items.length} items`);

        res.json({
            success: true,
            data: {
                items,
                pagination: {
                    currentPage: page,
                    totalItems: totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNextPage: page < Math.ceil(totalCount / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching landing page items:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch items'
        });
    }
});

// GET /categories - Get all categories for filters
router.get('/categories', async (req, res) => {
    try {
        const categories = await itemModel.getAllCategories();
        
        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

// GET /search - Search items
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                error: 'Search term is required'
            });
        }

        console.log(`🔍 Searching items for: "${searchTerm}"`);

        const items = await itemModel.searchItems(searchTerm, limit, offset);

        res.json({
            success: true,
            data: {
                items,
                searchTerm,
                pagination: {
                    currentPage: page,
                    totalItems: items.length,
                    hasNextPage: items.length === limit,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error searching items:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search items'
        });
    }
});

// GET /category/:categoryId - Get items by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        console.log(`📂 Fetching items for category ID: ${categoryId}`);

        const items = await itemModel.getItemsByCategory(categoryId, limit, offset);

        res.json({
            success: true,
            data: {
                items,
                categoryId,
                pagination: {
                    currentPage: page,
                    totalItems: items.length,
                    hasNextPage: items.length === limit,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching items by category:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch items by category'
        });
    }
});

// GET /:itemId - Get item details
router.get('/:itemId', async (req, res) => {
    try {
        const itemId = parseInt(req.params.itemId);

        console.log(`📦 Fetching item details for ID: ${itemId}`);

        const item = await itemModel.getItemById(itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }

        res.json({
            success: true,
            data: item
        });

    } catch (error) {
        console.error('❌ Error fetching item details:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch item details'
        });
    }
});

// Test route
router.get('/test/items', (req, res) => {
    res.json({
        message: 'Items routes working!',
        endpoints: {
            'Landing Items': 'GET /items/landing-item-list?page=1&limit=20',
            'Categories': 'GET /items/categories',
            'Search': 'GET /items/search?q=searchterm',
            'By Category': 'GET /items/category/:categoryId',
            'Item Details': 'GET /items/:itemId'
        }
    });
});

module.exports = router;
