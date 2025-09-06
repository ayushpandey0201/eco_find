import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import ImageGallery from '../components/ImageGallery';

// Mock product data - in real app, this would come from API
const mockProductData = {
  '1': {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. This classic piece features genuine leather construction with a timeless design that never goes out of style. Perfect for fall and winter seasons, offering both warmth and style. The jacket has been well-maintained and shows minimal signs of wear.',
    price: 7500,
    category: 'Clothing',
    location: 'Connaught Place, Delhi',
    distance: 2.5,
    images: [
      'https://via.placeholder.com/600x400?text=Leather+Jacket+Front',
      'https://via.placeholder.com/600x400?text=Leather+Jacket+Back',
      'https://via.placeholder.com/600x400?text=Leather+Jacket+Detail',
      'https://via.placeholder.com/600x400?text=Leather+Jacket+Inside'
    ],
    seller: {
      id: 'seller1',
      name: 'Priya Sharma',
      rating: 4.8,
      reviewCount: 23,
      memberSince: '2022',
      avatar: 'https://via.placeholder.com/100x100?text=PS'
    },
    condition: 'Excellent',
    size: 'Medium',
    brand: 'Vintage Collection',
    postedDate: '2024-01-15',
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  // Add more mock products as needed
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      setLoading(true);
      // In real app, this would be an API call
      setTimeout(() => {
        const productData = mockProductData[id];
        setProduct(productData);
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSeller = () => {
    setShowContactInfo(true);
  };

  const handleChatWithSeller = () => {
    // Navigate to chat page with seller
    window.location.href = `/chat/${product.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link to="/" className="btn-primary">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Marketplace
              </Link>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">{product.category}</span>
            </li>
            <li>
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{product.title}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.images} alt={product.title} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {product.condition}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Condition</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.condition}</dd>
                </div>
                {product.size && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Size</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.size}</dd>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Brand</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.brand}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Location */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{product.location} • {product.distance}km away</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.seller.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{product.seller.rating} ({product.seller.reviewCount} reviews)</span>
                    </div>
                    <span>•</span>
                    <span>Member since {product.seller.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <button
                onClick={handleChatWithSeller}
                className="w-full btn-primary text-lg py-3"
              >
                Chat with Seller
              </button>
              
              <button
                onClick={handleContactSeller}
                className="w-full btn-outline text-lg py-3"
              >
                {showContactInfo ? 'Contact Info Shared' : 'Request Contact Info'}
              </button>

              {showContactInfo && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Contact information has been shared with the seller. 
                    They will receive your details and can reach out to you directly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;
