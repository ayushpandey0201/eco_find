import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

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

  // Note: Google Maps API key needs to be configured
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
          <p className="text-gray-500 mb-4">
            Configure Google Maps API key to enable map view
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <p className="text-sm text-yellow-800">
              <strong>Setup Instructions:</strong><br />
              1. Get a Google Maps API key from Google Cloud Console<br />
              2. Add it to your .env file as REACT_APP_GOOGLE_MAPS_API_KEY<br />
              3. Enable Maps JavaScript API and Places API
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {products.map((product) => (
          <Marker
            key={product.id}
            position={product.coordinates}
            onClick={() => setSelectedProduct(product)}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#22c55e" stroke="#fff" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="bold">$</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        ))}

        {selectedProduct && (
          <InfoWindow
            position={selectedProduct.coordinates}
            onCloseClick={() => setSelectedProduct(null)}
          >
            <div className="max-w-xs">
              <img
                src={selectedProduct.images?.[0] || 'https://via.placeholder.com/200x120?text=No+Image'}
                alt={selectedProduct.title}
                className="w-full h-24 object-cover rounded-t-lg"
              />
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {selectedProduct.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {selectedProduct.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  <button
                    onClick={() => window.open(`/product/${selectedProduct.id}`, '_blank')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{selectedProduct.location}</span>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
