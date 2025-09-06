import React from 'react';

const DistanceFilter = ({ distance, onDistanceChange, maxDistance = 1000 }) => {
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
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">
          Distance Filter
        </label>
        <span className="text-sm text-primary-600 font-medium">
          {formatDistance(distance)}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="1"
          max={maxDistance}
          value={distance}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${(distance / maxDistance) * 100}%, #e5e7eb ${(distance / maxDistance) * 100}%, #e5e7eb 100%)`
          }}
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1km</span>
          <span>1000km</span>
        </div>
      </div>
    </div>
  );
};

export default DistanceFilter;
