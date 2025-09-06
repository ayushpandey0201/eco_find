const express = require('express');
const router = express.Router();

// Mock database for users
// In production, replace with actual database calls
let users = [
  {
    id: 'user1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    avatar: 'https://via.placeholder.com/150',
    location: 'Delhi, India',
    memberSince: '2023',
    rating: 4.8,
    reviewCount: 15,
    bio: 'Eco-conscious buyer looking for sustainable products.',
    phone: '+91-9876543210',
    verified: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'seller1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    avatar: 'https://via.placeholder.com/100x100?text=PS',
    location: 'Connaught Place, Delhi',
    memberSince: '2022',
    rating: 4.8,
    reviewCount: 23,
    bio: 'Selling pre-loved fashion items in excellent condition.',
    phone: '+91-9123456789',
    verified: true,
    createdAt: new Date('2022-06-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'seller2',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    avatar: 'https://via.placeholder.com/100x100?text=RK',
    location: 'Koramangala, Bangalore',
    memberSince: '2021',
    rating: 4.9,
    reviewCount: 45,
    bio: 'Tech enthusiast selling quality electronics.',
    phone: '+91-9234567890',
    verified: true,
    createdAt: new Date('2021-03-20'),
    updatedAt: new Date('2024-01-12')
  }
];

// GET /api/users/:id - Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find user by ID
    const user = users.find(user => user.id === id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user profile (excluding sensitive information)
    const { phone, ...publicProfile } = user;
    
    res.json({
      success: true,
      data: publicProfile
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find user index
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate email format if being updated
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }

    // Validate phone format if being updated
    if (updates.phone) {
      const phoneRegex = /^\+91-\d{10}$/;
      if (!phoneRegex.test(updates.phone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone format. Use +91-XXXXXXXXXX'
        });
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    // Return updated profile (excluding sensitive information)
    const { phone, ...publicProfile } = users[userIndex];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: publicProfile
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating user',
      error: error.message
    });
  }
});

// GET /api/users/:id/items - Get items listed by a specific user
router.get('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status = 'active' } = req.query;
    
    // Check if user exists
    const user = users.find(user => user.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mock items data - In production, fetch from items collection
    // For now, returning empty array as items are managed in items.js
    const userItems = [];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          rating: user.rating,
          reviewCount: user.reviewCount,
          memberSince: user.memberSince
        },
        items: userItems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(userItems.length / limit),
          totalItems: userItems.length,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user items',
      error: error.message
    });
  }
});

// GET /api/users/:id/reviews - Get reviews for a user
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check if user exists
    const user = users.find(user => user.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mock reviews data - In production, fetch from reviews collection
    const mockReviews = [
      {
        id: 'review1',
        reviewerId: 'user2',
        reviewerName: 'Amit Patel',
        reviewerAvatar: 'https://via.placeholder.com/50',
        rating: 5,
        comment: 'Great seller! Item was exactly as described and shipped quickly.',
        createdAt: new Date('2024-01-10'),
        itemTitle: 'Vintage Leather Jacket'
      },
      {
        id: 'review2',
        reviewerId: 'user3',
        reviewerName: 'Sneha Gupta',
        reviewerAvatar: 'https://via.placeholder.com/50',
        rating: 4,
        comment: 'Good communication and fair pricing. Would buy again.',
        createdAt: new Date('2024-01-05'),
        itemTitle: 'MacBook Pro 13"'
      }
    ];

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReviews = mockReviews.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          rating: user.rating,
          reviewCount: user.reviewCount
        },
        reviews: paginatedReviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(mockReviews.length / limit),
          totalReviews: mockReviews.length,
          reviewsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user reviews',
      error: error.message
    });
  }
});

// POST /api/users/:id/reviews - Add a review for a user
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerId, rating, comment, itemId } = req.body;
    
    // Validate required fields
    if (!reviewerId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['reviewerId', 'rating', 'comment']
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user exists
    const user = users.find(user => user.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if reviewer exists
    const reviewer = users.find(user => user.id === reviewerId);
    if (!reviewer) {
      return res.status(404).json({
        success: false,
        message: 'Reviewer not found'
      });
    }

    // Create new review (in production, save to database)
    const newReview = {
      id: `review${Date.now()}`,
      userId: id,
      reviewerId,
      reviewerName: reviewer.name,
      reviewerAvatar: reviewer.avatar,
      rating: parseInt(rating),
      comment: comment.trim(),
      itemId: itemId || null,
      createdAt: new Date()
    };

    // Update user's rating and review count (simplified calculation)
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      const currentTotal = users[userIndex].rating * users[userIndex].reviewCount;
      const newTotal = currentTotal + parseInt(rating);
      const newCount = users[userIndex].reviewCount + 1;
      
      users[userIndex].rating = Math.round((newTotal / newCount) * 10) / 10;
      users[userIndex].reviewCount = newCount;
      users[userIndex].updatedAt = new Date();
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: newReview
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding review',
      error: error.message
    });
  }
});

// GET /api/users/search - Search users by name or location
router.get('/search', async (req, res) => {
  try {
    const { query, location, page = 1, limit = 10 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    let filteredUsers = [...users];
    const searchTerm = query.toLowerCase();

    // Filter by name
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm)
    );

    // Filter by location if provided
    if (location) {
      filteredUsers = filteredUsers.filter(user =>
        user.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Remove sensitive information
    const publicUsers = paginatedUsers.map(({ phone, ...publicProfile }) => publicProfile);

    res.json({
      success: true,
      data: publicUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredUsers.length / limit),
        totalUsers: filteredUsers.length,
        usersPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching users',
      error: error.message
    });
  }
});

module.exports = router;
