import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css'; // Import the CSS file
import NowPlaying from './components/NowPlaying';
import Controls from './components/Controls';
import VolumeControl from './components/VolumeControl';
import { fetchVolume, fetchNowPlaying, fetchPlaybackState, setVolume, seekPlayback, togglePlayPause, skipToNext, skipToPrevious } from './services/api';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [nowPlaying, setNowPlaying] = useState({ title: '', artist: '', artwork: '' });
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  useEffect(() => {
    const fetchInitialVolume = async () => {
      try {
        const data = await fetchVolume();
        setVolumeState(data.volume);
      } catch (error) {
        console.error('Error fetching volume:', error);
      }
    };

    fetchInitialVolume();

    const interval = setInterval(fetchInitialVolume, 10000); // Fetch volume every 10 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const fetchNowPlayingData = async () => {
    try {
      const data = await fetchNowPlaying();
      setNowPlaying({ 
        title: data.info.name, 
        artist: data.info.artistName, 
        artwork: data.info.artwork.url.replace('{w}', '600').replace('{h}', '600') 
      });
    } catch (error) {
      console.error('Error fetching now playing:', error);
    }
  };

  const fetchPlaybackStateData = async () => {
    try {
      const data = await fetchPlaybackState();
      setIsPlaying(data.isPlaying);
    } catch (error) {
      console.error('Error fetching playback state:', error);
    }
  };

  useEffect(() => {
    fetchNowPlayingData();
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

        fetchNowPlayingData();
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
    const exponentialVolume = Math.pow(linearVolume, 2); // Exponential transformation
    setVolumeState(linearVolume);

    try {
      await setVolume(exponentialVolume);
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const handleSeekChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlaybackTime = parseFloat(e.target.value);
    setPlaybackTime(newPlaybackTime);

    try {
      await seekPlayback(newPlaybackTime);
    } catch (error) {
      console.error('Error seeking playback:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      await togglePlayPause();
      fetchPlaybackStateData();
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleNext = async () => {
    try {
      await skipToNext();
      fetchNowPlayingData();
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await skipToPrevious();
      fetchNowPlayingData();
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-96">
        <NowPlaying title={nowPlaying.title} artist={nowPlaying.artist} artwork={nowPlaying.artwork} />
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
        <Controls isPlaying={isPlaying} onPlayPause={handlePlayPause} onNext={handleNext} onPrevious={handlePrevious} />
        <VolumeControl isMuted={isMuted} volume={volume} onMuteToggle={() => setIsMuted(!isMuted)} onVolumeChange={handleVolumeChange} />
      </div>
    </div>
  );
};

export default App;