import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import io from 'socket.io-client';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // Default volume set to 50%
  const [nowPlaying, setNowPlaying] = useState({ title: '', artist: '' });
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  useEffect(() => {
    const fetchVolume = async () => {
      try {
        const response = await fetch('http://localhost:10767/api/v1/playback/volume');
        const data = await response.json();
        setVolume(data.volume);
      } catch (error) {
        console.error('Error fetching volume:', error);
      }
    };

    fetchVolume();
  }, []);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('http://localhost:10767/api/v1/playback/now-playing');
        const data = await response.json();
        setNowPlaying({ title: data.info.name, artist: data.info.artistName });
      } catch (error) {
        console.error('Error fetching now playing:', error);
      }
    };

    fetchNowPlaying();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:10767');

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('API:Playback', (data) => {
        setPlaybackTime(data.data.currentPlaybackTime);
        setPlaybackDuration(data.data.currentPlaybackDuration);
        setIsPlaying(data.data.isPlaying);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // You might want to send the new volume to the API here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96">
        {/* Now Playing Section */}
        <div className="mb-8 text-center">
          <h2 className="text-gray-200 text-lg font-semibold mb-2">Now Playing</h2>
          <p className="text-gray-400">{nowPlaying.title || 'Song Title'}</p>
          <p className="text-gray-500 text-sm">{nowPlaying.artist || 'Artist Name'}</p>
        </div>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-1 bg-gray-700 rounded-full">
            <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${(playbackTime / playbackDuration) * 100}%` }}></div>
          </div>
          <div className="flex justify-between text-gray-400 text-sm mt-1">
            <span>{Math.floor(playbackTime / 60)}:{Math.floor(playbackTime % 60).toString().padStart(2, '0')}</span>
            <span>{Math.floor(playbackDuration / 60)}:{Math.floor(playbackDuration % 60).toString().padStart(2, '0')}</span>
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
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default App;