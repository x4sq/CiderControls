import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  isMuted: boolean;
  volume: number;
  onMuteToggle: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ isMuted, volume, onMuteToggle, onVolumeChange }) => {
  return (
    <div className="flex items-center gap-4">
      <button 
        className="text-gray-400 hover:text-white transition-colors"
        onClick={onMuteToggle}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={onVolumeChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;