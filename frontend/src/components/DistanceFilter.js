import React from 'react';

const DistanceFilter = ({ distance, onDistanceChange, maxDistance = 100 }) => {
  const handleSliderChange = (e) => {
    onDistanceChange(parseInt(e.target.value));
  };

  const formatDistance = (km) => {
    if (km < 1) {
      return `${km * 1000}m`;
    } else if (km >= 1000) {
      return `${km / 1000}k km`;
    }
    return `${km}km`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <label className="text-lg font-semibold text-warm heading-handwritten">
          Distance Range
        </label>
        <span className="text-earth-green font-bold text-lg">
          {formatDistance(distance)}
        </span>
      </div>
      
      <div className="relative mb-4">
        <input
          type="range"
          min="1"
          max={maxDistance}
          value={distance}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              #68d391 0%, 
              #38a169 ${(distance / maxDistance) * 100}%, 
              #e2e8f0 ${(distance / maxDistance) * 100}%, 
              #e2e8f0 100%)`
          }}
        />
        
        <div className="flex justify-between text-sm text-warm-muted mt-3">
          <span>1km</span>
          <span>100km</span>
        </div>
      </div>

      {/* Distance markers with natural descriptions */}
      <div className="flex justify-between text-xs text-warm-secondary">
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1 text-earth-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Walking distance
        </span>
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1 text-earth-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2C5.588 2 2 5.588 2 10s3.588 8 8 8 8-3.588 8-8-3.588-8-8-8zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          City-wide
        </span>
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1 text-earth-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
          </svg>
          Regional
        </span>
      </div>

      {/* Helpful tip */}
      <div className="mt-4 text-xs text-warm-muted italic">
        Choose a smaller radius to find treasures you can easily pick up in person.
      </div>
    </div>
  );
};

export default DistanceFilter;
