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
    <Link to={`/product/${product.id}`} className="group">
      <div className="product-card-glass cursor-pointer overflow-hidden">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute top-3 right-3">
            <span className="glass-card px-3 py-1 text-xs font-medium text-glass">
              {product.category}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-white/80 drop-shadow">
                {formatDistance(product.distance || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-glass text-lg mb-2 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          
          <p className="text-glass-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center text-sm text-glass-muted">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{product.location}</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-white/0 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default ProductCard;
