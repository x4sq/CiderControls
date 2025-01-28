import React from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, onPlayPause, onNext, onPrevious }) => {
  return (
    <div className="flex items-center justify-center gap-6 mb-8">
      <button className="text-gray-400 hover:text-white transition-colors" onClick={onPrevious}>
        <SkipBack size={24} />
      </button>
      <button 
        className="bg-blue-500 p-4 rounded-full hover:bg-blue-600 transition-colors"
        onClick={onPlayPause}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button className="text-gray-400 hover:text-white transition-colors" onClick={onNext}>
        <SkipForward size={24} />
      </button>
    </div>
  );
};

export default Controls;