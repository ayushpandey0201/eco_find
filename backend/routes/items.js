const express = require('express');
const router = express.Router();

// Mock database - In production, replace with actual database calls
// This simulates a database with sample items
let items = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Perfect for winter months.',
    price: 7500,
    image: 'https://via.placeholder.com/300x200?text=Leather+Jacket',
    category: 'Clothing',
    location: 'Connaught Place, Delhi',
    distance: 2.5,
    sellerId: 'seller1',
    seller: {
      id: 'seller1',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      rating: 4.8,
      reviewCount: 23,
      memberSince: '2022',
      avatar: 'https://via.placeholder.com/100x100?text=PS'
    },
    condition: 'Excellent',
    size: 'Medium',
    brand: 'Vintage Collection',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'MacBook Pro 13" 2019',
    description: 'Well-maintained MacBook Pro with original charger and box. Great for students and professionals.',
    price: 65000,
    image: 'https://via.placeholder.com/300x200?text=MacBook+Pro',
    category: 'Electronics',
    location: 'Koramangala, Bangalore',
    distance: 1.2,
    sellerId: 'seller2',
    seller: {
      id: 'seller2',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      rating: 4.9,
      reviewCount: 45,
      memberSince: '2021',
      avatar: 'https://via.placeholder.com/100x100?text=RK'
    },
    condition: 'Excellent',
    brand: 'Apple',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Handmade Ceramic Vase',
    description: 'Beautiful handcrafted ceramic vase from local artisan, perfect for home decoration.',
    price: 2800,
    image: 'https://via.placeholder.com/300x200?text=Ceramic+Vase',
    category: 'Home & Garden',
    location: 'Banjara Hills, Hyderabad',
    distance: 3.8,
    sellerId: 'seller3',
    seller: {
      id: 'seller3',
      name: 'Anita Reddy',
      email: 'anita.reddy@example.com',
      rating: 4.7,
      reviewCount: 18,
      memberSince: '2023',
      avatar: 'https://via.placeholder.com/100x100?text=AR'
    },
    condition: 'Like New',
    brand: 'Handmade',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'Hero Hybrid Cycle',
    description: 'Excellent condition Hero hybrid bicycle. Perfect for city commuting and fitness.',
    price: 8500,
    image: 'https://via.placeholder.com/300x200?text=Hero+Cycle',
    category: 'Sports',
    location: 'Andheri West, Mumbai',
    distance: 5.2,
    sellerId: 'seller4',
    seller: {
      id: 'seller4',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      rating: 4.6,
      reviewCount: 32,
      memberSince: '2022',
      avatar: 'https://via.placeholder.com/100x100?text=AP'
    },
    condition: 'Good',
    brand: 'Hero',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '5',
    title: 'Vintage Bollywood Vinyl Collection',
    description: 'Collection of 50+ vintage Bollywood vinyl records from the 70s and 80s. Rare finds!',
    price: 12000,
    image: 'https://via.placeholder.com/300x200?text=Vinyl+Records',
    category: 'Music',
    location: 'Park Street, Kolkata',
    distance: 4.1,
    sellerId: 'seller5',
    seller: {
      id: 'seller5',
      name: 'Suresh Gupta',
      email: 'suresh.gupta@example.com',
      rating: 4.9,
      reviewCount: 67,
      memberSince: '2020',
      avatar: 'https://via.placeholder.com/100x100?text=SG'
    },
    condition: 'Good',
    brand: 'Various',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

// GET /api/items - Fetch all items (for LandingPage)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      location, 
      distance,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let filteredItems = [...items];

    // Filter by category
    if (category && category !== 'All') {
      filteredItems = filteredItems.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (minPrice) {
      filteredItems = filteredItems.filter(item => item.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredItems = filteredItems.filter(item => item.price <= parseFloat(maxPrice));
    }

    // Filter by distance
    if (distance) {
      filteredItems = filteredItems.filter(item => 
        item.distance <= parseFloat(distance)
      );
    }

    // Sort items
    filteredItems.sort((a, b) => {
      let aValue = a[sort];
      let bValue = b[sort];

      if (sort === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    // Return paginated response
    res.json({
      success: true,
      data: paginatedItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredItems.length / limit),
        totalItems: filteredItems.length,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching items',
      error: error.message
    });
  }
});

// GET /api/items/:id - Fetch single item by ID (for ProductDetailsPage)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find item by ID
    const item = items.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Return full item details including seller info
    res.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching item',
      error: error.message
    });
  }
});

// POST /api/items - Create new item (for SellItemPage)
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      image, 
      category, 
      sellerId,
      location,
      condition,
      brand,
      size
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category || !sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['title', 'description', 'price', 'category', 'sellerId']
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Validate category
    const validCategories = ['Clothing', 'Electronics', 'Home & Garden', 'Sports', 'Music', 'Furniture', 'Books', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
        validCategories
      });
    }

    // Create new item
    const newItem = {
      id: String(items.length + 1), // In production, use proper ID generation
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image: image || 'https://via.placeholder.com/300x200?text=No+Image',
      category,
      location: location || 'India',
      distance: Math.random() * 10, // Mock distance
      sellerId,
      condition: condition || 'Good',
      brand: brand || 'Unbranded',
      size: size || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock database
    items.push(newItem);

    // Return created item
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: newItem
    });

  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating item',
      error: error.message
    });
  }
});

// PUT /api/items/:id - Update existing item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find item index
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Update item
    items[itemIndex] = {
      ...items[itemIndex],
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: items[itemIndex]
    });

  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating item',
      error: error.message
    });
  }
});

// DELETE /api/items/:id - Delete item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find item index
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Remove item
    const deletedItem = items.splice(itemIndex, 1)[0];

    res.json({
      success: true,
      message: 'Item deleted successfully',
      data: deletedItem
    });

  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting item',
      error: error.message
    });
  }
});

module.exports = router;
