import React from 'react';

interface NowPlayingProps {
  title: string;
  artist: string;
  artwork: string;
}

const NowPlaying: React.FC<NowPlayingProps> = ({ title, artist, artwork }) => {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-gray-200 text-lg font-semibold mb-2">Now Playing</h2>
      <img src={artwork} alt="Artwork" className="mb-4 w-48 h-48 mx-auto rounded-lg shadow-lg" />
      <p className="text-gray-400">{title || 'Song Title'}</p>
      <p className="text-gray-500 text-sm">{artist || 'Artist Name'}</p>
    </div>
  );
};

export default NowPlaying;