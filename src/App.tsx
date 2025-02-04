import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import NowPlaying from './components/NowPlaying';
import Controls from './components/Controls';
import VolumeControl from './components/VolumeControl';
import { initializeSocket, handleSocketEvents } from './services/socket';
import { setVolume, seekPlayback, togglePlayPause, skipToNext, skipToPrevious, fetchNowPlaying, fetchVolume, fetchShuffleMode, toggleShuffleMode, fetchRepeatMode, toggleRepeatMode } from './services/api';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [nowPlaying, setNowPlaying] = useState({ title: 'No song playing', artist: 'Unknown Artist', artwork: 'https://cider.sh/CC24-transparent.svg' });
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [shuffleState, setShuffleState] = useState<number | undefined>(undefined);
  const [repeatState, setRepeatState] = useState<number | undefined>(undefined);
  const playbackTimeRef = useRef(playbackTime);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const nowPlayingData = await fetchNowPlaying();
        setNowPlaying({ 
          title: nowPlayingData.info.name, 
          artist: nowPlayingData.info.artistName, 
          artwork: nowPlayingData.info.artwork.url.replace('{w}', '3000').replace('{h}', '3000') 
        });

        const volumeData = await fetchVolume();
        setVolumeState(volumeData.volume);

        const shuffleData = await fetchShuffleMode();
        setShuffleState(shuffleData.value);
      

        const repeatData = await fetchRepeatMode();
        setRepeatState(repeatData.value);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    const socket = initializeSocket();

    handleSocketEvents(socket, {
      setPlaybackTime: (time) => {
        playbackTimeRef.current = time;
        setPlaybackTime(time);
      },
      setPlaybackDuration,
      setIsPlaying,
      setNowPlaying: (nowPlaying) => {
        if (nowPlaying.title && nowPlaying.artist && nowPlaying.artwork) {
          setNowPlaying(nowPlaying);
        } else {
          setNowPlaying({ title: 'No song playing', artist: ' ', artwork: 'https://cider.sh/CC24-transparent.svg' });
        }
      },
      setVolumeState,
      setShuffleState: (data) => {
        setShuffleState(data);
      },
      setRepeatState: (data) => {
        setRepeatState(data);
      },
    });

    socket.on('connect_error', () => {
      setNowPlaying({ title: 'No song playing', artist: ' ', artwork: 'https://cider.sh/CC24-transparent.svg' });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const linearVolume = parseFloat(e.target.value);
    setVolumeState(linearVolume);
    setVolume(linearVolume).catch((error) => {
      console.error('Error setting volume:', error);
    });
  };

  const handleSeekChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlaybackTime = parseFloat(e.target.value);
    setPlaybackTime(newPlaybackTime);
    playbackTimeRef.current = newPlaybackTime;

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

  const handleRepeat = async () => {
    try {
      await toggleRepeatMode();
      setRepeatState((prev) => (prev !== undefined ? (prev % 3) + 1 : 1)); // Cycle through 1, 2, 3
    } catch (error) {
      console.error('Error toggling repeat mode:', error);
    }
  };

  const handleShuffle = async () => {
    try {
      await toggleShuffleMode();
      setShuffleState((prev) => (prev !== undefined ? (prev === 1 ? 0 : 1) : 1)); // Toggle shuffle mode
    } catch (error) {
      console.error('Error toggling shuffle mode:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center justify-center">
      <NowPlaying title={nowPlaying.title} artist={nowPlaying.artist} artwork={nowPlaying.artwork} />
      <div className="mb-6 w-full px-8">
        <input
          type="range"
          min="0"
          max={playbackDuration || 0}
          step="0.01"
          value={playbackTime || 0}
          onChange={handleSeekChange}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-400 text-sm mt-1">
          <span>{Math.floor(playbackTime / 60)}:{Math.floor(playbackTime % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor(playbackDuration / 60)}:{Math.floor(playbackDuration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>
      <Controls 
        isPlaying={isPlaying} 
        isShuffle={shuffleState === 1} 
        isRepeat={repeatState ?? 0} 
        onPlayPause={handlePlayPause} 
        onNext={handleNext} 
        onPrevious={handlePrevious} 
        onRepeat={handleRepeat} 
        onShuffle={handleShuffle} 
      />
      <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
    </div>
  );
};

export default App;