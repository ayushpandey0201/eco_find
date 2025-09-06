# SecondChance Frontend

A sustainable second-hand marketplace built with React, connecting buyers and sellers for eco-friendly shopping experiences.

## 🎯 What Has Been Implemented

### ✅ Core Features
- **Authentication System**: Google OAuth integration with mock login for development
- **Landing Page**: Beautiful, responsive marketplace with product grid/map views
- **Product Details**: Comprehensive product pages with image galleries and seller info
- **Sell Item Flow**: Complete form for listing products with image upload
- **Chat System**: AI chatbot for initial queries + seller communication channels
- **Location Filtering**: Distance-based product filtering with slider control
- **Google Maps Integration**: Interactive map with product markers and popups
- **Responsive Design**: Mobile-first design with Tailwind CSS

### ✅ Technical Implementation
- **React Router**: Complete navigation system with protected routes
- **Context API**: Authentication state management
- **Tailwind CSS**: Beautiful, consistent styling throughout
- **Component Architecture**: Reusable, modular components
- **Image Management**: Drag-and-drop upload with preview and reordering
- **Mock Data**: Comprehensive sample data for development

### ✅ User Flows
1. **Login Flow**: Google OAuth → Landing Page
2. **Browse Flow**: Search/Filter → Product Details → Chat
3. **Sell Flow**: Create Listing → Upload Images → Publish
4. **Chat Flow**: AI Assistant → Seller Connection → Direct Chat

## 🚧 What Still Needs to Be Built

### Backend Integration
- Replace mock data with real API calls
- Implement user authentication backend
- Set up product database and CRUD operations
- Chat system backend (WebSocket/Socket.io)
- Image upload to cloud storage (AWS S3/Cloudinary)

### Advanced Features
- Real-time chat notifications
- User profiles and ratings system
- Advanced search and filtering
- Payment integration
- Email notifications
- Push notifications for mobile

### Enhancements
- Image optimization and lazy loading
- Offline support with service workers
- Advanced map features (clustering, custom markers)
- Social sharing capabilities
- Favorites/Wishlist functionality

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone and navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your API keys:
   # REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   # REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000` to authorized origins
6. Copy Client ID to your `.env` file

### Google Maps Setup

1. In Google Cloud Console, enable Maps JavaScript API
2. Create an API key
3. Restrict the key to Maps JavaScript API
4. Add the key to your `.env` file

### Development Features

- **Mock Login**: Use "Mock Login (Development)" button for testing without Google OAuth
- **Mock Data**: Sample products and users for development
- **Hot Reload**: Automatic refresh on code changes
- **Error Boundaries**: Graceful error handling

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── ProductCard.js
│   │   ├── ImageGallery.js
│   │   ├── ImageUpload.js
│   │   ├── DistanceFilter.js
│   │   ├── MapView.js
│   │   └── LoadingSpinner.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── LandingPage.js
│   │   ├── ProductDetailsPage.js
│   │   ├── SellItemPage.js
│   │   └── ChatPage.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── routes/
│   │   └── AppRoutes.js
│   ├── services/
│   │   └── authService.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Green tones for sustainability theme
- **Secondary**: Warm yellow accents
- **Neutral**: Gray scale for content

### Components
- **Cards**: Consistent shadow and hover effects
- **Buttons**: Primary, secondary, and outline variants
- **Forms**: Validation states and error handling
- **Navigation**: Responsive header with mobile menu

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## 🌱 Sustainability Features

- **Second-hand Focus**: Promoting reuse over new purchases
- **Local Discovery**: Reducing shipping environmental impact
- **Eco-friendly Messaging**: Encouraging sustainable choices
- **Green Color Palette**: Visual reinforcement of environmental values

## 📱 Mobile Responsiveness

- Mobile-first design approach
- Touch-friendly interface elements
- Responsive grid layouts
- Optimized image sizes
- Accessible navigation patterns

---

**Status**: Frontend scaffold complete and ready for backend integration
**Next Steps**: Implement backend APIs and replace mock data with real functionality
