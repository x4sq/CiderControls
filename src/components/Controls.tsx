import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: number | undefined;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRepeat: () => void;
  onShuffle: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, isShuffle, isRepeat = 0, onPlayPause, onNext, onPrevious, onRepeat, onShuffle }) => {
  const getRepeatColor = () => {
    switch (isRepeat) {
      case 0:
        return 'text-gray-400';
      case 1:
        return 'text-blue-500';
      case 2:
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 mb-8">
      <button
        className={`transition-colors ${isShuffle ? 'text-blue-500' : 'text-gray-400'} hover:text-white`}
        onClick={onShuffle}
      >
        <Shuffle size={24} />
      </button>
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
      <button
        className={`transition-colors ${getRepeatColor()} hover:text-white`}
        onClick={onRepeat}
      >
        <Repeat size={24} />
      </button>
    </div>
  );
};

export default Controls;