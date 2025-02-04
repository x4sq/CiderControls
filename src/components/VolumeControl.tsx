import React, { useState, useEffect } from 'react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  const [localVolume, setLocalVolume] = useState(volume);

  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVolume(parseFloat(e.target.value));
    onVolumeChange(e);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={localVolume}
        onChange={handleChange}
        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;