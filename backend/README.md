# SecondChance Backend Requirements

This document outlines the backend functionality that needs to be implemented to support the SecondChance frontend application.

## 🎯 Overview

The backend should be built using Node.js/Express or Python/FastAPI to provide REST APIs for authentication, product management, chat functionality, and user management.

## 🔐 Authentication System

### Google OAuth Integration
**Purpose**: Secure user authentication using Google OAuth 2.0
**Function**: Validate Google ID tokens and manage user sessions

#### Required Endpoints:
- `POST /auth/google` - Verify Google ID token and create/login user
- `POST /auth/logout` - Invalidate user session
- `GET /auth/me` - Get current user information
- `POST /auth/refresh` - Refresh authentication token

#### Implementation Details:
- Use `google-auth-library` to verify ID tokens
- Generate JWT tokens for session management
- Store user data in database with Google ID mapping
- Implement token refresh mechanism
- Handle first-time user registration vs. returning users

## 👤 User Management

### User Profile System
**Purpose**: Store and manage user information and preferences
**Function**: Handle user data, ratings, and account settings

#### Database Schema:
```sql
Users {
  id: UUID (primary key)
  google_id: String (unique)
  email: String (unique)
  name: String
  avatar_url: String
  member_since: DateTime
  rating: Float (default: 0)
  review_count: Integer (default: 0)
  location: String (optional)
  phone: String (optional)
  created_at: DateTime
  updated_at: DateTime
}
```

#### Required Endpoints:
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /users/:id` - Get public user information
- `GET /users/:id/reviews` - Get user reviews and ratings

## 🛍️ Product Management

### Product CRUD Operations
**Purpose**: Handle product listings, searches, and management
**Function**: Store product data, images, and enable filtering/searching

#### Database Schema:
```sql
Products {
  id: UUID (primary key)
  seller_id: UUID (foreign key to Users)
  title: String
  description: Text
  price: Decimal
  category: String
  condition: String
  location: String
  latitude: Float
  longitude: Float
  images: JSON Array
  status: Enum ('active', 'sold', 'withdrawn')
  view_count: Integer (default: 0)
  created_at: DateTime
  updated_at: DateTime
}
```

#### Required Endpoints:
- `GET /products` - List products with filtering/search/pagination
- `GET /products/:id` - Get single product details
- `POST /products` - Create new product listing
- `PUT /products/:id` - Update product (seller only)
- `DELETE /products/:id` - Delete/withdraw product (seller only)
- `POST /products/:id/view` - Increment view count

#### Query Parameters for GET /products:
- `search` - Text search in title/description
- `category` - Filter by category
- `condition` - Filter by condition
- `min_price`, `max_price` - Price range
- `lat`, `lng`, `radius` - Location-based filtering
- `sort` - Sort by date, price, distance
- `page`, `limit` - Pagination

## 📸 Image Management

### File Upload System
**Purpose**: Handle product image uploads and storage
**Function**: Upload, resize, and serve product images

#### Implementation Requirements:
- Use cloud storage (AWS S3, Cloudinary, or Google Cloud Storage)
- Implement image resizing and optimization
- Generate multiple sizes (thumbnail, medium, full)
- Secure upload with file type validation
- Image deletion when product is removed

#### Required Endpoints:
- `POST /upload/images` - Upload multiple images
- `DELETE /upload/images/:id` - Delete specific image
- `GET /images/:size/:filename` - Serve optimized images

#### Image Processing:
- Resize to standard dimensions (400x400, 800x800, 1200x1200)
- Compress to reduce file size
- Generate thumbnails for listings
- Watermark images with SecondChance logo (optional)

## 💬 Chat System

### Real-time Messaging
**Purpose**: Enable communication between buyers and sellers
**Function**: Handle chat rooms, message history, and notifications

#### Database Schema:
```sql
ChatRooms {
  id: UUID (primary key)
  product_id: UUID (foreign key to Products)
  buyer_id: UUID (foreign key to Users)
  seller_id: UUID (foreign key to Users)
  status: Enum ('active', 'closed')
  created_at: DateTime
  updated_at: DateTime
}

Messages {
  id: UUID (primary key)
  chat_room_id: UUID (foreign key to ChatRooms)
  sender_id: UUID (foreign key to Users)
  message: Text
  message_type: Enum ('text', 'image', 'system')
  read_at: DateTime (nullable)
  created_at: DateTime
}
```

#### Required Endpoints:
- `GET /chat/rooms` - Get user's chat rooms
- `GET /chat/rooms/:id` - Get chat room details
- `POST /chat/rooms` - Create new chat room
- `GET /chat/rooms/:id/messages` - Get message history
- `POST /chat/rooms/:id/messages` - Send message
- `PUT /chat/messages/:id/read` - Mark message as read

#### WebSocket Implementation:
- Real-time message delivery using Socket.io
- User online/offline status
- Typing indicators
- Message read receipts
- Push notifications for offline users

## 🤖 AI Chatbot Integration

### Chatbot Service
**Purpose**: Provide automated responses to common questions
**Function**: Answer product questions and help users navigate

#### Implementation Options:
1. **OpenAI GPT Integration**: Use GPT-3.5/4 for intelligent responses
2. **Rule-based System**: Pre-defined responses for common questions
3. **Hybrid Approach**: Rules + AI for fallback

#### Required Functionality:
- Product-specific question answering
- General marketplace help
- Escalation to human sellers
- Learning from conversation patterns

#### Endpoints:
- `POST /chatbot/message` - Send message to chatbot
- `GET /chatbot/suggested-questions` - Get suggested questions for product

## 🗺️ Location Services

### Geolocation and Distance Calculation
**Purpose**: Enable location-based product discovery
**Function**: Calculate distances and provide location-based filtering

#### Required Functionality:
- Store product coordinates (latitude/longitude)
- Calculate distances between user and products
- Geocoding for address to coordinates conversion
- Reverse geocoding for coordinates to address

#### Endpoints:
- `POST /location/geocode` - Convert address to coordinates
- `POST /location/reverse-geocode` - Convert coordinates to address
- `GET /location/nearby` - Find nearby products

#### Implementation:
- Use Google Maps Geocoding API
- Implement haversine formula for distance calculation
- Cache geocoding results to reduce API calls
- Support multiple location formats

## 📊 Analytics and Monitoring

### Usage Analytics
**Purpose**: Track application usage and performance
**Function**: Monitor user behavior and system health

#### Metrics to Track:
- User registration and login rates
- Product listing and viewing patterns
- Chat engagement metrics
- Search and filter usage
- Conversion rates (views to contacts)

#### Implementation:
- Database logging for key events
- Integration with analytics services (Google Analytics, Mixpanel)
- Performance monitoring (response times, error rates)
- User behavior tracking (anonymized)

## 🔒 Security Requirements

### Data Protection and Security
**Purpose**: Protect user data and prevent abuse
**Function**: Implement security best practices

#### Security Measures:
- Input validation and sanitization
- Rate limiting for API endpoints
- SQL injection prevention
- XSS protection
- CORS configuration
- Environment variable management
- Database encryption for sensitive data
- Secure file upload validation

#### Required Middleware:
- Authentication verification
- Request logging
- Error handling
- Rate limiting
- Input validation

## 📧 Notification System

### Email and Push Notifications
**Purpose**: Keep users engaged and informed
**Function**: Send relevant notifications about activities

#### Notification Types:
- New message in chat
- Product interest notifications
- Price drop alerts
- Account security notifications
- Marketing emails (with opt-out)

#### Implementation:
- Email service (SendGrid, AWS SES, or NodeMailer)
- Push notification service (Firebase Cloud Messaging)
- Template-based email system
- User notification preferences
- Unsubscribe functionality

## 🛡️ Content Moderation

### Safety and Quality Control
**Purpose**: Maintain platform quality and user safety
**Function**: Moderate content and prevent abuse

#### Moderation Features:
- Automated content filtering for inappropriate content
- Image recognition for prohibited items
- Spam detection for messages and listings
- User reporting system
- Admin dashboard for content review
- Automated account suspension for violations

## 🚀 Deployment Requirements

### Infrastructure and DevOps
**Purpose**: Deploy and maintain the backend service
**Function**: Ensure reliable, scalable service delivery

#### Deployment Stack:
- Container deployment (Docker)
- Cloud hosting (AWS, Google Cloud, or Heroku)
- Database hosting (PostgreSQL on cloud)
- File storage (AWS S3 or Google Cloud Storage)
- CDN for image delivery
- Load balancing for high availability

#### Environment Configuration:
- Separate staging and production environments
- Environment variables for sensitive data
- Database migrations and seeding
- Automated backup system
- Monitoring and alerting

## 📋 API Documentation

### Interactive API Documentation
**Purpose**: Provide clear API documentation for frontend integration
**Function**: Document all endpoints with examples

#### Requirements:
- Swagger/OpenAPI documentation
- Interactive API testing interface
- Request/response examples
- Authentication flow documentation
- Error code documentation
- Rate limiting information

---

## 🛠️ Technology Stack Recommendations

### Backend Framework:
- **Node.js + Express** (JavaScript/TypeScript)
- **Python + FastAPI** (Python)
- **Ruby on Rails** (Ruby)

### Database:
- **PostgreSQL** (recommended for relational data)
- **MongoDB** (if preferring NoSQL)

### File Storage:
- **AWS S3** (scalable, reliable)
- **Google Cloud Storage**
- **Cloudinary** (built-in image processing)

### Real-time Communication:
- **Socket.io** (WebSocket management)
- **WebSocket native implementation**

### Authentication:
- **JWT tokens** for session management
- **Google OAuth 2.0** for authentication

---

**Status**: Backend requirements documented and ready for implementation
**Next Steps**: Choose technology stack and begin API development
