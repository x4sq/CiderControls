export const fetchVolume = async () => {
  const response = await fetch('http://localhost:10767/api/v1/playback/volume');
  return response.json();
};

export const fetchNowPlaying = async () => {
  const response = await fetch('http://localhost:10767/api/v1/playback/now-playing');
  return response.json();
};

export const fetchPlaybackState = async () => {
  const response = await fetch('http://localhost:10767/api/v1/playback/is-playing');
  return response.json();
};

export const setVolume = async (volume: number) => {
  await fetch('http://localhost:10767/api/v1/playback/volume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ volume }),
  });
};

export const seekPlayback = async (position: number) => {
  await fetch('http://localhost:10767/api/v1/playback/seek', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ position }),
  });
};

export const togglePlayPause = async () => {
  await fetch('http://localhost:10767/api/v1/playback/playpause', {
    method: 'POST',
  });
};

export const skipToNext = async () => {
  await fetch('http://localhost:10767/api/v1/playback/next', {
    method: 'POST',
  });
};

export const skipToPrevious = async () => {
  await fetch('http://localhost:10767/api/v1/playback/previous', {
    method: 'POST',
  });
};