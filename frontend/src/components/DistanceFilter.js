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
      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-semibold text-glass">
          Distance Filter
        </label>
        <span className="text-glass bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold text-lg">
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
          className="w-full h-3 rounded-full appearance-none cursor-pointer bg-white/10 backdrop-blur-sm"
          style={{
            background: `linear-gradient(to right, 
              rgba(96, 165, 250, 0.8) 0%, 
              rgba(168, 85, 247, 0.8) ${(distance / maxDistance) * 100}%, 
              rgba(255, 255, 255, 0.1) ${(distance / maxDistance) * 100}%, 
              rgba(255, 255, 255, 0.1) 100%)`
          }}
        />
        
        <div className="flex justify-between text-sm text-glass-muted mt-3">
          <span>1km</span>
          <span>100km</span>
        </div>
      </div>

      {/* Distance markers */}
      <div className="flex justify-between text-xs text-glass-muted mt-2">
        <span>Nearby</span>
        <span>City-wide</span>
        <span>Regional</span>
      </div>
    </div>
  );
};

export default DistanceFilter;
