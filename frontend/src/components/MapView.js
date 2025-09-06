import React, { useState, useCallback } from 'react';
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

const MapView = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Temporary placeholder for Google Maps - will be enabled when API key is configured
  return (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
        <p className="text-gray-500 mb-4">
          Interactive map with product locations
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            <strong>Map Features:</strong><br />
            • Product markers with location data<br />
            • Click markers for product previews<br />
            • Distance-based filtering<br />
            • Interactive navigation<br />
            <br />
            <em>Will be fully functional when Google Maps API is configured</em>
          </p>
        </div>
        
        {/* Show product list as fallback */}
        <div className="mt-6 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-white p-3 rounded-lg shadow text-left">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/150x100?text=No+Image'}
                alt={product.title}
                className="w-full h-20 object-cover rounded mb-2"
              />
              <h4 className="font-medium text-sm mb-1">{product.title}</h4>
              <p className="text-primary-600 font-bold text-sm">${product.price}</p>
              <p className="text-xs text-gray-500">{product.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
