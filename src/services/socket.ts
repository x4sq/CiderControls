import { io, Socket } from 'socket.io-client';

interface SocketHandlers {
  setPlaybackTime: (time: number) => void;
  setPlaybackDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setNowPlaying: (nowPlaying: { title: string; artist: string; artwork: string }) => void;
  setVolumeState: (volume: number) => void;
}

export const initializeSocket = (): Socket => {
  const socket = io('http://localhost:10767');

  socket.on('connect', () => {
    console.log('Connected to socket.io server');
    socket.emit('API:RequestCurrentPlayback');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket.io server');
  });

  return socket;
};

export const handleSocketEvents = (socket: Socket, handlers: SocketHandlers): void => {
  socket.on('API:Playback', (data) => {
    console.log(data);
    if (data.type === 'playbackStatus.playbackTimeDidChange') {
      handlers.setPlaybackTime(data.data.currentPlaybackTime);
      handlers.setPlaybackDuration(data.data.currentPlaybackDuration);
      handlers.setIsPlaying(data.data.isPlaying);
      socket.emit('API:RequestCurrentPlayback');
    } else if (data.type === 'playbackStatus.nowPlayingItemDidChange') {
      const { name, artistName, artwork } = data.data;
      if (name && artistName && artwork) {
        handlers.setNowPlaying({ 
          title: name, 
          artist: artistName, 
          artwork: artwork.url.replace('{w}', '200').replace('{h}', '200') 
        });
      } else {
        console.error('Error: Missing now playing data', data.data.info);
      }
    } else if (data.type === 'playerStatus.volumeDidChange') {
      handlers.setVolumeState(data.data.volume);
    } else if (data.type === 'playbackStatus.playbackStateDidChange') {
      if (data.data.state === 'seeking') {
        handlers.setPlaybackTime(data.data.currentPlaybackTime);
        handlers.setPlaybackDuration(data.data.remainingPlaybackTime);
      } else {
        handlers.setIsPlaying(data.data.isPlaying);
      }
    }
  });

  socket.on('API:RequestCurrentPlayback', (data) => {
    console.log('Current playback information:', data);
    handlers.setPlaybackTime(data.currentPlaybackTime);
    handlers.setPlaybackDuration(data.currentPlaybackDuration);
    handlers.setIsPlaying(data.isPlaying);
    const { name, artistName, artwork } = data.info;
    if (name && artistName && artwork) {
      handlers.setNowPlaying({ 
        title: name, 
        artist: artistName, 
        artwork: artwork.url.replace('{w}', '200').replace('{h}', '200') 
      });
    } else {
      console.error('Error: Missing now playing data', data.info);
    }
  });
};