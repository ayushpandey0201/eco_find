import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="product-card-organic cursor-pointer overflow-hidden gentle-float">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {/* Category Tag */}
          <div className="absolute top-3 right-3">
            <span className="natural-card px-3 py-1 text-xs font-medium text-earth-green bg-white/90">
              {product.category}
            </span>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xl font-bold text-white drop-shadow-lg">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-warm text-lg mb-2 line-clamp-2 leading-tight group-hover:text-earth-green transition-colors duration-300">
            {product.title}
          </h3>
          
          <p className="text-warm-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-warm-muted">
              <svg className="w-4 h-4 mr-2 text-earth-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{product.location}</span>
            </div>
            
            <span className="text-xs text-warm-muted bg-green-50 px-2 py-1 rounded-full">
              {formatDistance(product.distance || 0)}
            </span>
          </div>

          {/* Sustainability Badge */}
          <div className="mt-3 pt-3 border-t border-green-100">
            <div className="flex items-center text-xs text-earth-green">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Sustainable Choice</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
