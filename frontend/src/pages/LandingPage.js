import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import DistanceFilter from '../components/DistanceFilter';

// Mock data for India - development
const mockProducts = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Perfect for winter months.',
    price: 7500,
    category: 'Clothing',
    location: 'Connaught Place, Delhi',
    distance: 2.5,
    images: ['https://via.placeholder.com/300x200?text=Leather+Jacket'],
    sellerId: 'seller1'
  },
  {
    id: '2',
    title: 'MacBook Pro 13" 2019',
    description: 'Well-maintained MacBook Pro with original charger and box. Great for students and professionals.',
    price: 65000,
    category: 'Electronics',
    location: 'Koramangala, Bangalore',
    distance: 1.2,
    images: ['https://via.placeholder.com/300x200?text=MacBook+Pro'],
    sellerId: 'seller2'
  },
  {
    id: '3',
    title: 'Handmade Ceramic Vase',
    description: 'Beautiful handcrafted ceramic vase from local artisan, perfect for home decoration.',
    price: 2800,
    category: 'Home & Garden',
    location: 'Banjara Hills, Hyderabad',
    distance: 3.8,
    images: ['https://via.placeholder.com/300x200?text=Ceramic+Vase'],
    sellerId: 'seller3'
  },
  {
    id: '4',
    title: 'Hero Hybrid Cycle',
    description: 'Excellent condition Hero hybrid bicycle. Perfect for city commuting and fitness.',
    price: 8500,
    category: 'Sports',
    location: 'Andheri West, Mumbai',
    distance: 5.2,
    images: ['https://via.placeholder.com/300x200?text=Hero+Cycle'],
    sellerId: 'seller4'
  },
  {
    id: '5',
    title: 'Vintage Bollywood Vinyl Collection',
    description: 'Collection of 50+ vintage Bollywood vinyl records from the 70s and 80s. Rare finds!',
    price: 12000,
    category: 'Music',
    location: 'Park Street, Kolkata',
    distance: 4.1,
    images: ['https://via.placeholder.com/300x200?text=Vinyl+Records'],
    sellerId: 'seller5'
  },
  {
    id: '6',
    title: 'Teak Wood Dining Table',
    description: 'Beautiful teak wood dining table seats 6. Moving to new city - must sell!',
    price: 25000,
    category: 'Furniture',
    location: 'Jayanagar, Bangalore',
    distance: 1.8,
    images: ['https://via.placeholder.com/300x200?text=Dining+Table'],
    sellerId: 'seller6'
  },
  {
    id: '7',
    title: 'iPhone 12 Pro',
    description: 'iPhone 12 Pro 128GB in mint condition. All accessories included with original box.',
    price: 42000,
    category: 'Electronics',
    location: 'Sector 18, Gurgaon',
    distance: 6.3,
    images: ['https://via.placeholder.com/300x200?text=iPhone+12'],
    sellerId: 'seller7'
  },
  {
    id: '8',
    title: 'Handwoven Banarasi Saree',
    description: 'Exquisite handwoven Banarasi silk saree with intricate gold work. Wedding collection.',
    price: 15000,
    category: 'Clothing',
    location: 'Varanasi, UP',
    distance: 8.1,
    images: ['https://via.placeholder.com/300x200?text=Banarasi+Saree'],
    sellerId: 'seller8'
  }
];

const categories = ['All', 'Clothing', 'Electronics', 'Home & Garden', 'Sports', 'Music', 'Furniture'];

const LandingPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState(25);

  // Filter products based on category, search, and distance
  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Distance filter
    filtered = filtered.filter(product => product.distance <= distanceFilter);

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, distanceFilter]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="hero-glass p-8 mb-10 text-center float-animation">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-glass">
            Discover Sustainable
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Treasures
            </span>
          </h1>
          <p className="text-glass-secondary text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Give pre-loved items a second chance while reducing waste and saving money. 
            Find amazing deals in your neighborhood across India.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-4 w-6 h-6 text-glass-muted" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search for items across India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full pl-14 pr-6 py-4 text-lg"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-glass">{mockProducts.length}+</div>
              <div className="text-glass-secondary text-sm">Items Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-glass">50+</div>
              <div className="text-glass-secondary text-sm">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-glass">1000+</div>
              <div className="text-glass-secondary text-sm">Happy Users</div>
            </div>
          </div>
        </div>

        {/* Filters and Products */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-72 space-y-6">
            {/* Distance Filter */}
            <div className="filter-glass p-6">
              <DistanceFilter
                distance={distanceFilter}
                onDistanceChange={setDistanceFilter}
              />
            </div>

            {/* Category Filter */}
            <div className="filter-glass p-6">
              <h3 className="text-lg font-semibold text-glass mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category} className="flex items-center group cursor-pointer">
                    <div className="relative">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                        selectedCategory === category 
                          ? 'border-white bg-gradient-to-r from-blue-400 to-purple-400' 
                          : 'border-white/30 group-hover:border-white/50'
                      }`}>
                        {selectedCategory === category && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <span className="ml-3 text-glass-secondary group-hover:text-glass transition-colors duration-300 font-medium">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="glass-card p-4 mb-8">
              <div className="flex items-center justify-between">
                <p className="text-glass text-lg font-medium">
                  {filteredProducts.length} items found
                  {selectedCategory !== 'All' && (
                    <span className="text-glass-secondary"> in {selectedCategory}</span>
                  )}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-glass-secondary text-sm">Live Updates</span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-fade-in-up"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="hero-glass p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 glass-card flex items-center justify-center">
                  <svg className="w-12 h-12 text-glass-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.9-6.1-2.372M15 21H9a6 6 0 01-6-6V9a6 6 0 016-6h6a6 6 0 016 6v6a6 6 0 01-6 6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-glass mb-2">No items found</h3>
                <p className="text-glass-secondary mb-6">
                  Try adjusting your filters or search terms to discover more treasures.
                </p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setDistanceFilter(25);
                  }}
                  className="btn-glass-primary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
