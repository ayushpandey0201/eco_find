# SecondChance - Sustainable Second-Hand Marketplace

🌱 **Give items a second chance while helping the environment**

A modern React-based marketplace connecting buyers and sellers for sustainable second-hand shopping experiences.

![SecondChance Logo](https://via.placeholder.com/800x200/22c55e/ffffff?text=SecondChance+-+Sustainable+Marketplace)

## 🎯 Live Demo

The frontend is ready to run locally! Follow the setup instructions below.

## ✨ Features

### 🔐 Authentication
- **Google OAuth Integration** (with mock login for development)
- Secure user sessions and protected routes
- User profile management

### 🛍️ Marketplace
- **Beautiful Product Grid** with responsive design
- **Advanced Search & Filtering** by category, price, distance
- **Product Details** with image galleries and seller information
- **Distance-Based Discovery** from 1km to 1000km radius

### 💬 Communication
- **AI Chatbot** for initial product questions
- **Direct Seller Chat** for personalized communication
- **Privacy-First Contact** sharing (hidden until both parties agree)

### 📍 Location Features
- **Interactive Map View** with product markers (placeholder ready for Google Maps API)
- **Geolocation Filtering** for local discoveries
- **Distance Calculations** for nearby products

### 🎨 Modern Design
- **Mobile-First Responsive Design**
- **Tailwind CSS** for beautiful, consistent styling
- **Smooth Animations** and hover effects
- **Accessibility Features** with proper ARIA labels

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd eco_find
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000)

5. **Login**
   Use "Mock Login (Development)" button to test without OAuth setup

## 📁 Project Structure

```
eco_find/
├── frontend/                 # Complete React Application
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── pages/          # Main Application Pages
│   │   ├── context/        # State Management
│   │   ├── routes/         # Navigation System
│   │   └── services/       # API & Auth Services
│   ├── package.json
│   └── README.md           # Detailed frontend documentation
├── backend/
│   └── README.md           # Backend API requirements
├── .gitignore
└── README.md               # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Context API** - State management
- **Axios** - HTTP client for API calls

### Planned Backend
- **Node.js + Express** or **Python + FastAPI**
- **PostgreSQL** database
- **JWT** authentication
- **Socket.io** for real-time chat
- **Cloud storage** for images

## 🎨 Design Philosophy

### Sustainability First
- **Green Color Palette** reinforcing environmental values
- **Eco-Friendly Messaging** throughout the app
- **Local Discovery** to reduce shipping impact
- **Second-Chance Branding** promoting reuse over waste

### User Experience
- **Intuitive Navigation** with clear user flows
- **Mobile-Optimized** touch interactions
- **Fast Loading** with optimized components
- **Accessibility** compliant design

## 📱 Mobile Experience

The app is fully responsive and optimized for:
- **Touch Interactions** - Swipe, tap, pinch gestures
- **Mobile Navigation** - Collapsible menus and touch-friendly buttons
- **Optimized Images** - Proper sizing for mobile bandwidth
- **Fast Performance** - Optimized for mobile devices

## 🚧 Development Status

### ✅ Completed
- [x] Complete React frontend scaffold
- [x] Google OAuth authentication (with mock login)
- [x] Product listing and detail pages
- [x] Search and filtering system
- [x] Chat system with AI assistant
- [x] Sell item form with image upload
- [x] Map view placeholder
- [x] Responsive mobile design
- [x] Comprehensive documentation

### 🔄 In Progress
- [ ] Backend API development
- [ ] Real Google Maps integration
- [ ] Database integration
- [ ] Real-time chat backend

### 📋 Planned Features
- [ ] User profiles and ratings
- [ ] Payment integration
- [ ] Push notifications
- [ ] Advanced search with AI
- [ ] Social sharing
- [ ] Admin dashboard

## 🌍 Environmental Impact

SecondChance promotes sustainability by:
- **Extending Product Lifecycles** - Giving items a second chance
- **Reducing Waste** - Keeping usable items out of landfills
- **Local Trading** - Minimizing shipping and transportation
- **Community Building** - Connecting neighbors for local exchanges

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📞 Support

- **Frontend Issues**: Check `frontend/README.md` for detailed setup
- **Backend Development**: See `backend/README.md` for API specifications
- **General Questions**: Open an issue on GitHub

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for beautiful styling utilities
- **Google Maps** for location services
- **All contributors** who make this project possible

---

**🌱 Join us in making second-hand the first choice for sustainable shopping!**

Built with ❤️ for the environment and community.
