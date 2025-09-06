# SecondChance - Setup Guide

A complete React-based sustainable second-hand marketplace ready for hackathon development.

## 🎉 What's Been Built

### ✅ Complete Frontend Implementation
- **Modern React Application** with Tailwind CSS styling
- **Google OAuth Authentication** (with mock login for development)
- **Beautiful Landing Page** with product cards and search functionality
- **Product Details Pages** with image galleries and seller information
- **Sell Item Form** with drag-and-drop image upload
- **Chat System** with AI chatbot and seller communication
- **Google Maps Integration** with product markers and distance filtering
- **Responsive Design** that works on all devices

### ✅ All Required Features Implemented
- ✅ Google OAuth login with redirect to landing page
- ✅ Responsive UI with product cards showing image, title, price, description, location
- ✅ Product detail view with full description, images, and seller details
- ✅ Chat system with chatbot + seller communication options
- ✅ "Sell an Item" form with image upload and product details
- ✅ Location filtering with distance slider (1km → 1000km)
- ✅ Google Maps with product markers and popup previews
- ✅ Clean folder structure in `/frontend` directory
- ✅ Comprehensive documentation for both frontend and backend

## 🚀 Quick Start (Frontend)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open http://localhost:3000

5. **Login with mock data**
   Click "Mock Login (Development)" to test without Google OAuth setup

## 🔑 API Keys Setup (Optional)

### For Google OAuth:
1. Get Google Client ID from Google Cloud Console
2. Copy `frontend/env.example` to `frontend/.env`
3. Add your `REACT_APP_GOOGLE_CLIENT_ID`

### For Google Maps:
1. Enable Maps JavaScript API in Google Cloud Console
2. Add your `REACT_APP_GOOGLE_MAPS_API_KEY` to `.env`

## 📁 Project Structure

```
eco_find/
├── frontend/                    # Complete React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Main application pages
│   │   ├── context/           # Authentication state management
│   │   ├── routes/            # Navigation and routing
│   │   └── services/          # API and authentication services
│   ├── package.json           # Dependencies and scripts
│   ├── tailwind.config.js     # Styling configuration
│   └── README.md             # Frontend documentation
├── backend/
│   └── README.md             # Backend requirements and API specs
└── SETUP_GUIDE.md            # This file
```

## 🎨 Key Features Implemented

### Authentication Flow
- Google OAuth integration with secure token handling
- Mock login system for development
- Protected routes and session management
- User context and state management

### Marketplace Features
- **Product Discovery**: Search, filter by category, distance-based filtering
- **Product Cards**: Beautiful grid layout with images, prices, locations
- **Product Details**: Full-screen image galleries, seller information, chat buttons
- **Selling Flow**: Complete form with image upload, categorization, pricing

### Chat System
- **AI Chatbot**: Intelligent responses to product questions
- **Seller Communication**: Direct chat channels with real-time messaging simulation
- **Contact Sharing**: Privacy-focused contact information sharing

### Map Integration
- **Interactive Maps**: Google Maps with custom product markers
- **Location Filtering**: Distance slider from 1km to 1000km
- **Product Markers**: Clickable markers with product previews
- **Location Services**: Geocoding and distance calculations

## 💻 Technology Stack

- **Frontend**: React 18 + React Router + Tailwind CSS
- **Authentication**: Google OAuth 2.0 + JWT tokens
- **Maps**: Google Maps API + React Google Maps
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Heroicons (via Tailwind)
- **Images**: Drag-and-drop upload with preview

## 🔧 Development Features

- **Hot Reload**: Instant updates during development
- **Mock Data**: Sample products and users for testing
- **Error Handling**: Graceful error boundaries and loading states
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation
- **SEO Ready**: Proper meta tags and semantic HTML

## 📱 Mobile Experience

- **Touch-Friendly**: Optimized for mobile interactions
- **Responsive Grid**: Adapts to all screen sizes
- **Mobile Navigation**: Collapsible menu and touch gestures
- **Image Optimization**: Proper sizing for mobile bandwidth

## 🌱 Sustainability Focus

- **Eco-Friendly Messaging**: Promoting reuse and environmental consciousness
- **Local Discovery**: Encouraging local transactions to reduce shipping
- **Green Design**: Color palette reinforcing environmental values
- **Second-Chance Branding**: Clear mission of giving items a second life

## 🎯 Ready for Hackathon

This scaffold provides everything needed for a hackathon demo:

1. **Immediate Demo**: Run `npm start` and demo the full user flow
2. **Mock Data**: Pre-populated with sample products and users
3. **Visual Polish**: Professional UI that impresses judges
4. **Full User Stories**: Complete flows from login to purchase communication
5. **Scalable Architecture**: Ready for backend integration

## 📝 Next Steps for Development

1. **Backend Implementation**: Follow `/backend/README.md` for API requirements
2. **Real Data Integration**: Replace mock data with actual API calls
3. **Enhanced Features**: Add user profiles, reviews, payment integration
4. **Performance Optimization**: Implement lazy loading, caching
5. **Production Deployment**: Set up CI/CD and cloud hosting

## 🏆 Demo Script for Hackathon

1. **Show Landing Page**: Beautiful, responsive marketplace
2. **Demonstrate Search**: Filter by category, distance, search terms
3. **Product Details**: Click product → full details with image gallery
4. **Chat System**: Show AI assistant → escalate to seller chat
5. **Sell Flow**: Add new product with image upload
6. **Map View**: Toggle to map, show markers and popups
7. **Mobile Demo**: Show responsive design on mobile

---

**🎉 Congratulations!** You now have a complete, polished React application ready for demonstration or further development. The frontend is fully functional with mock data, and the backend requirements are thoroughly documented for implementation.

**Time to Demo**: ~2 minutes to install and run
**Demo Duration**: ~5-10 minutes to show all features
**Judge Appeal**: Professional UI, smooth UX, clear sustainability mission
