import React, { useState, useEffect } from 'react';
import './index.css';
import NowPlaying from './components/NowPlaying';
import Controls from './components/Controls';
import VolumeControl from './components/VolumeControl';
import { initializeSocket, handleSocketEvents } from './services/socket';
import { setVolume, seekPlayback, togglePlayPause, skipToNext, skipToPrevious } from './services/api';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [nowPlaying, setNowPlaying] = useState({ title: '', artist: '', artwork: '' });
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  useEffect(() => {
    const socket = initializeSocket();

    handleSocketEvents(socket, {
      setPlaybackTime,
      setPlaybackDuration,
      setIsPlaying,
      setNowPlaying,
      setVolumeState,
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const linearVolume = parseFloat(e.target.value);
    const exponentialVolume = Math.pow(linearVolume, 2);
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
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleNext = async () => {
    try {
      await skipToNext();
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous track:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center justify-center">
      <NowPlaying title={nowPlaying.title} artist={nowPlaying.artist} artwork={nowPlaying.artwork} />
      <div className="mb-6 w-full px-8">
        <input
          type="range"
          min="0"
          max={playbackDuration}
          step="0.01"
          value={playbackTime}
          onChange={handleSeekChange}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-400 text-sm mt-1">
          <span>{Math.floor(playbackTime / 60)}:{Math.floor(playbackTime % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor(playbackDuration / 60)}:{Math.floor(playbackDuration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>
      <Controls isPlaying={isPlaying} onPlayPause={handlePlayPause} onNext={handleNext} onPrevious={handlePrevious} />
      <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
    </div>
  );
};

export default App;