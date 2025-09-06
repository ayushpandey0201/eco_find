const express = require('express');
const router = express.Router();

// Mock database for messages and chats
// In production, replace with actual database calls
let chats = [
  {
    id: 'chat1',
    productId: '1',
    buyerId: 'user1',
    sellerId: 'seller1',
    status: 'active',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z')
  },
  {
    id: 'chat2',
    productId: '2',
    buyerId: 'user2',
    sellerId: 'seller2',
    status: 'active',
    createdAt: new Date('2024-01-14T09:00:00Z'),
    updatedAt: new Date('2024-01-14T16:45:00Z')
  }
];

let messages = [
  {
    id: 'msg1',
    chatId: 'chat1',
    senderId: 'user1',
    senderType: 'buyer',
    text: 'Hi! I\'m interested in the vintage leather jacket. Is it still available?',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    readAt: new Date('2024-01-15T10:05:00Z')
  },
  {
    id: 'msg2',
    chatId: 'chat1',
    senderId: 'seller1',
    senderType: 'seller',
    text: 'Hello! Yes, the jacket is still available. It\'s in excellent condition with minimal wear.',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    readAt: new Date('2024-01-15T10:35:00Z')
  },
  {
    id: 'msg3',
    chatId: 'chat1',
    senderId: 'user1',
    senderType: 'buyer',
    text: 'Great! Can you tell me more about the sizing? I\'m looking for something that fits a medium.',
    timestamp: new Date('2024-01-15T11:00:00Z'),
    readAt: new Date('2024-01-15T11:10:00Z')
  },
  {
    id: 'msg4',
    chatId: 'chat1',
    senderId: 'seller1',
    senderType: 'seller',
    text: 'It\'s labeled as medium and fits true to size. The measurements are: chest 42 inches, length 26 inches.',
    timestamp: new Date('2024-01-15T14:30:00Z'),
    readAt: null
  },
  {
    id: 'msg5',
    chatId: 'chat2',
    senderId: 'user2',
    senderType: 'buyer',
    text: 'Is the MacBook Pro still under warranty?',
    timestamp: new Date('2024-01-14T09:00:00Z'),
    readAt: new Date('2024-01-14T09:15:00Z')
  },
  {
    id: 'msg6',
    chatId: 'chat2',
    senderId: 'seller2',
    senderType: 'seller',
    text: 'The original warranty has expired, but it\'s been very well maintained. I can provide purchase receipts.',
    timestamp: new Date('2024-01-14T16:45:00Z'),
    readAt: null
  }
];

// GET /api/messages/:chatId - Fetch all messages for a chat (for ChatPage)
router.get('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Validate chatId
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID is required'
      });
    }

    // Check if chat exists
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Get messages for this chat
    let chatMessages = messages.filter(msg => msg.chatId === chatId);

    // Sort messages by timestamp (oldest first)
    chatMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMessages = chatMessages.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        chat,
        messages: paginatedMessages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(chatMessages.length / limit),
          totalMessages: chatMessages.length,
          messagesPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching messages',
      error: error.message
    });
  }
});

// POST /api/messages - Send a new message (for ChatPage)
router.post('/', async (req, res) => {
  try {
    const { chatId, senderId, text, senderType = 'buyer' } = req.body;

    // Validate required fields
    if (!chatId || !senderId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['chatId', 'senderId', 'text']
      });
    }

    // Validate text length
    if (text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message text cannot be empty'
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message text cannot exceed 1000 characters'
      });
    }

    // Check if chat exists
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Create new message
    const newMessage = {
      id: `msg${messages.length + 1}`, // In production, use proper ID generation
      chatId,
      senderId,
      senderType,
      text: text.trim(),
      timestamp: new Date(),
      readAt: null
    };

    // Add to mock database
    messages.push(newMessage);

    // Update chat's updatedAt timestamp
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].updatedAt = new Date();
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending message',
      error: error.message
    });
  }
});

// GET /api/messages/chats/:userId - Get all chats for a user
router.get('/chats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all chats where user is either buyer or seller
    const userChats = chats.filter(chat => 
      chat.buyerId === userId || chat.sellerId === userId
    );

    // Get last message for each chat
    const chatsWithLastMessage = userChats.map(chat => {
      const chatMessages = messages.filter(msg => msg.chatId === chat.id);
      const lastMessage = chatMessages.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )[0];

      return {
        ...chat,
        lastMessage: lastMessage || null,
        unreadCount: chatMessages.filter(msg => 
          !msg.readAt && msg.senderId !== userId
        ).length
      };
    });

    // Sort by last activity
    chatsWithLastMessage.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    res.json({
      success: true,
      data: chatsWithLastMessage
    });

  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching chats',
      error: error.message
    });
  }
});

// POST /api/messages/chats - Create a new chat
router.post('/chats', async (req, res) => {
  try {
    const { productId, buyerId, sellerId } = req.body;

    // Validate required fields
    if (!productId || !buyerId || !sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['productId', 'buyerId', 'sellerId']
      });
    }

    // Check if chat already exists for this product and users
    const existingChat = chats.find(chat => 
      chat.productId === productId && 
      chat.buyerId === buyerId && 
      chat.sellerId === sellerId
    );

    if (existingChat) {
      return res.json({
        success: true,
        message: 'Chat already exists',
        data: existingChat
      });
    }

    // Create new chat
    const newChat = {
      id: `chat${chats.length + 1}`, // In production, use proper ID generation
      productId,
      buyerId,
      sellerId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock database
    chats.push(newChat);

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: newChat
    });

  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating chat',
      error: error.message
    });
  }
});

// PUT /api/messages/:messageId/read - Mark message as read
router.put('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    // Find message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only allow marking as read if user is not the sender
    if (messages[messageIndex].senderId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark own message as read'
      });
    }

    // Mark as read
    messages[messageIndex].readAt = new Date();

    res.json({
      success: true,
      message: 'Message marked as read',
      data: messages[messageIndex]
    });

  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while marking message as read',
      error: error.message
    });
  }
});

// DELETE /api/messages/:messageId - Delete a message
router.delete('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    // Find message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only allow deletion by the sender
    if (messages[messageIndex].senderId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    // Remove message
    const deletedMessage = messages.splice(messageIndex, 1)[0];

    res.json({
      success: true,
      message: 'Message deleted successfully',
      data: deletedMessage
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting message',
      error: error.message
    });
  }
});

module.exports = router;
