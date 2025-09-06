import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

// Mock data for demonstration
const mockChatbotResponses = [
  "I'd be happy to help you with questions about this item!",
  "Let me provide you with more details about this product.",
  "This looks like a great sustainable choice! What would you like to know?",
  "I can help you with pricing, condition, or pickup details.",
  "Would you like me to connect you with the seller for more specific questions?"
];

const mockProductData = {
  '1': {
    id: '1',
    title: 'Vintage Leather Jacket',
    price: 89.99,
    image: 'https://via.placeholder.com/100x100?text=Jacket',
    seller: {
      name: 'Sarah Johnson',
      avatar: 'https://via.placeholder.com/40x40?text=SJ'
    }
  }
};

const ChatPage = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatMode, setChatMode] = useState('bot'); // 'bot' or 'seller'
  const [isTyping, setIsTyping] = useState(false);
  const [product, setProduct] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load product data
    if (productId && mockProductData[productId]) {
      setProduct(mockProductData[productId]);
    }

    // Initialize chat with welcome message
    const welcomeMessage = {
      id: 'welcome',
      text: productId 
        ? `Hi! I'm here to help you with questions about "${mockProductData[productId]?.title || 'this item'}". What would you like to know?`
        : "Hello! I'm your SecondChance assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [productId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('seller') || lowerMessage.includes('contact')) {
      return "I can help you connect with the seller! Would you like me to create a direct chat channel with them?";
    } else if (lowerMessage.includes('price')) {
      return product 
        ? `The asking price is $${product.price}. This seems reasonable for the condition and market value.`
        : "I'd be happy to help with pricing questions!";
    } else if (lowerMessage.includes('condition')) {
      return "Based on the photos and description, this item appears to be in excellent condition. Would you like me to ask the seller for more specific details?";
    } else if (lowerMessage.includes('pickup') || lowerMessage.includes('delivery')) {
      return "For pickup and delivery details, I recommend chatting directly with the seller. Would you like me to connect you?";
    } else {
      return mockChatbotResponses[Math.floor(Math.random() * mockChatbotResponses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    if (chatMode === 'bot') {
      setIsTyping(true);
      
      // Simulate bot typing delay
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: generateBotResponse(newMessage),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const switchToSellerChat = () => {
    setChatMode('seller');
    const sellerMessage = {
      id: Date.now(),
      text: "Great! I've created a direct chat channel with the seller. They'll be notified and can respond when available.",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, sellerMessage]);

    // Simulate seller joining
    setTimeout(() => {
      const sellerJoinMessage = {
        id: Date.now() + 1,
        text: `Hi ${user.name}! I got your message about the ${product?.title || 'item'}. Happy to answer any questions!`,
        sender: 'seller',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, sellerJoinMessage]);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {product && (
                  <Link to={`/product/${product.id}`} className="flex items-center space-x-3 hover:opacity-80">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-primary-100 text-sm">${product.price}</p>
                    </div>
                  </Link>
                )}
                {!product && (
                  <div>
                    <h3 className="font-medium">SecondChance Assistant</h3>
                    <p className="text-primary-100 text-sm">General Support</p>
                  </div>
                )}
              </div>

              {/* Chat Mode Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  chatMode === 'bot' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {chatMode === 'bot' ? 'AI Assistant' : 'With Seller'}
                </div>
                {chatMode === 'bot' && product && (
                  <button
                    onClick={switchToSellerChat}
                    className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-colors"
                  >
                    Chat with Seller
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                } items-end space-x-2`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.sender === 'user' ? (
                      <img
                        src={user.imageUrl || 'https://via.placeholder.com/32'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : message.sender === 'bot' ? (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={product?.seller.avatar || 'https://via.placeholder.com/32'}
                        alt={product?.seller.name || 'Seller'}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : message.sender === 'bot'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-green-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${chatMode === 'bot' ? 'assistant' : 'seller'}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            {/* Quick Actions */}
            {chatMode === 'bot' && product && (
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setNewMessage("What's the condition like?")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Ask about condition
                </button>
                <button
                  onClick={() => setNewMessage("Is the price negotiable?")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Ask about price
                </button>
                <button
                  onClick={() => setNewMessage("How do I arrange pickup?")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Ask about pickup
                </button>
                <button
                  onClick={switchToSellerChat}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
                >
                  Chat with seller
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
