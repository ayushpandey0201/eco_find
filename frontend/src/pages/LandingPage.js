import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import DistanceFilter from '../components/DistanceFilter';
import MapView from '../components/MapView';

// Mock data for development
const mockProducts = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Perfect for fall and winter.',
    price: 89.99,
    category: 'Clothing',
    location: 'Downtown, San Francisco',
    distance: 2.5,
    images: ['https://via.placeholder.com/300x200?text=Leather+Jacket'],
    sellerId: 'seller1',
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: '2',
    title: 'MacBook Pro 13" 2019',
    description: 'Well-maintained MacBook Pro with original charger and box. Great for students.',
    price: 799.99,
    category: 'Electronics',
    location: 'Mission Bay, San Francisco',
    distance: 1.2,
    images: ['https://via.placeholder.com/300x200?text=MacBook+Pro'],
    sellerId: 'seller2',
    coordinates: { lat: 37.7699, lng: -122.3959 }
  },
  {
    id: '3',
    title: 'Handmade Ceramic Vase',
    description: 'Beautiful handcrafted ceramic vase, perfect for home decoration.',
    price: 34.50,
    category: 'Home & Garden',
    location: 'Castro, San Francisco',
    distance: 3.8,
    images: ['https://via.placeholder.com/300x200?text=Ceramic+Vase'],
    sellerId: 'seller3',
    coordinates: { lat: 37.7609, lng: -122.4350 }
  },
  {
    id: '4',
    title: 'Road Bike - Trek FX 3',
    description: 'Excellent condition Trek FX 3 hybrid bike. Perfect for city commuting.',
    price: 425.00,
    category: 'Sports',
    location: 'Presidio, San Francisco',
    distance: 5.2,
    images: ['https://via.placeholder.com/300x200?text=Trek+Bike'],
    sellerId: 'seller4',
    coordinates: { lat: 37.7989, lng: -122.4662 }
  },
  {
    id: '5',
    title: 'Vintage Record Collection',
    description: 'Collection of 50+ vinyl records from the 70s and 80s. Mostly rock and jazz.',
    price: 150.00,
    category: 'Music',
    location: 'Haight-Ashbury, San Francisco',
    distance: 4.1,
    images: ['https://via.placeholder.com/300x200?text=Vinyl+Records'],
    sellerId: 'seller5',
    coordinates: { lat: 37.7692, lng: -122.4481 }
  },
  {
    id: '6',
    title: 'Designer Dining Table',
    description: 'Modern oak dining table seats 6. Moving sale - must go!',
    price: 320.00,
    category: 'Furniture',
    location: 'SOMA, San Francisco',
    distance: 1.8,
    images: ['https://via.placeholder.com/300x200?text=Dining+Table'],
    sellerId: 'seller6',
    coordinates: { lat: 37.7857, lng: -122.4011 }
  }
];

const categories = ['All', 'Clothing', 'Electronics', 'Home & Garden', 'Sports', 'Music', 'Furniture'];

const LandingPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState(50);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Sustainable Treasures
          </h1>
          <p className="text-primary-100 text-lg mb-6 max-w-2xl">
            Give pre-loved items a second chance while reducing waste and saving money. 
            Find amazing deals in your neighborhood.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg">
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-4">
            {/* Distance Filter */}
            <DistanceFilter
              distance={distanceFilter}
              onDistanceChange={setDistanceFilter}
            />

            {/* Category Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Toggle and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} items found
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
              
              <div className="flex bg-white rounded-lg border p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>

            {/* Content Area */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <MapView products={filteredProducts} />
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.9-6.1-2.372M15 21H9a6 6 0 01-6-6V9a6 6 0 016-6h6a6 6 0 016 6v6a6 6 0 01-6 6z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
