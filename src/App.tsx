import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import io from 'socket.io-client';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [nowPlaying, setNowPlaying] = useState({ title: '', artist: '', artwork: '' });
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

    const interval = setInterval(fetchVolume, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch('http://localhost:10767/api/v1/playback/now-playing');
      const data = await response.json();
      setNowPlaying({ 
        title: data.info.name, 
        artist: data.info.artistName, 
        artwork: data.info.artwork.url.replace('{w}', '3000').replace('{h}', '3000') 
      });
    } catch (error) {
      console.error('Error fetching now playing:', error);
    }
  };

  const fetchPlaybackState = async () => {
    try {
      const response = await fetch('http://localhost:10767/api/v1/playback/is-playing');
      const data = await response.json();
      setIsPlaying(data.isPlaying);
    } catch (error) {
      console.error('Error fetching playback state:', error);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:10767');

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('API:Playback', (data) => {
      if (data.type === 'playbackStatus.playbackTimeDidChange') {
        setPlaybackTime(data.data.currentPlaybackTime);
        setPlaybackDuration(data.data.currentPlaybackDuration);
        setIsPlaying(data.data.isPlaying);

        fetchNowPlaying();
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const linearVolume = parseFloat(e.target.value);
    const exponentialVolume = Math.pow(linearVolume, 1.1); // Exponential transformation
    setVolume(linearVolume);

    try {
      await fetch('http://localhost:10767/api/v1/playback/volume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volume: exponentialVolume }),
      });
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const handleSeekChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlaybackTime = parseFloat(e.target.value);
    setPlaybackTime(newPlaybackTime);

    try {
      await fetch('http://localhost:10767/api/v1/playback/seek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position: newPlaybackTime }),
      });
    } catch (error) {
      console.error('Error seeking playback:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      await fetch('http://localhost:10767/api/v1/playback/playpause', {
        method: 'POST',
      });
      fetchPlaybackState();
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleNext = async () => {
    try {
      await fetch('http://localhost:10767/api/v1/playback/next', {
        method: 'POST',
      });
      fetchNowPlaying();
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await fetch('http://localhost:10767/api/v1/playback/previous', {
        method: 'POST',
      });
      fetchNowPlaying();
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96">
        {/* Now Playing Section */}
        <div className="mb-8 text-center">
          <h2 className="text-gray-200 text-lg font-semibold mb-2">Now Playing</h2>
          <img src={nowPlaying.artwork} alt="Artwork" className="mb-4 w-48 h-48 mx-auto rounded-lg shadow-lg" />
          <p className="text-gray-400">{nowPlaying.title || 'Song Title'}</p>
          <p className="text-gray-500 text-sm">{nowPlaying.artist || 'Artist Name'}</p>
        </div>
        {/* Progress Bar */}
        <div className="mb-6">
          <input
            type="range"
            min="0"
            max={playbackDuration}
            step="0.01"
            value={playbackTime}
            onChange={handleSeekChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-gray-400 text-sm mt-1">
            <span>{Math.floor(playbackTime / 60)}:{Math.floor(playbackTime % 60).toString().padStart(2, '0')}</span>
            <span>{Math.floor(playbackDuration / 60)}:{Math.floor(playbackDuration % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button className="text-gray-400 hover:text-white transition-colors" onClick={handlePrevious}>
            <SkipBack size={24} />
          </button>
          <button 
            className="bg-blue-500 p-4 rounded-full hover:bg-blue-600 transition-colors"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="text-gray-400 hover:text-white transition-colors" onClick={handleNext}>
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
            step="0.001"
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