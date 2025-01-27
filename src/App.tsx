import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96">
        {/* Now Playing Section */}
        <div className="mb-8 text-center">
          <h2 className="text-gray-200 text-lg font-semibold mb-2">Now Playing</h2>
          <p className="text-gray-400">Song Title</p>
          <p className="text-gray-500 text-sm">Artist Name</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-1 bg-gray-700 rounded-full">
            <div className="h-1 bg-blue-500 rounded-full w-1/3"></div>
          </div>
          <div className="flex justify-between text-gray-400 text-sm mt-1">
            <span>1:23</span>
            <span>3:45</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          <button 
            className="bg-blue-500 p-4 rounded-full hover:bg-blue-600 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-4">
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default App;