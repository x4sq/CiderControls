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

export const fetchNowPlaying = async () => {
  const response = await fetch('http://localhost:10767/api/v1/playback/now-playing');
  if (!response.ok) {
    throw new Error('Failed to fetch now playing');
  }
  return response.json();
};

export const fetchVolume = async () => {
  const response = await fetch('http://localhost:10767/api/v1/playback/volume');
  if (!response.ok) {
    throw new Error('Failed to fetch volume');
  }
  return response.json();
};

export const fetchShuffleMode = async () => {
  const response = await fetch('http://localhost:10767/api/v1/playback/shuffle-mode');
  if (!response.ok) {
    throw new Error('Failed to fetch shuffle mode');
  }
  return response.json();
};

export const toggleShuffleMode = async () => {
  await fetch('http://localhost:10767/api/v1/playback/toggle-shuffle', {
    method: 'POST',
  });
};

export const fetchRepeatMode = async () => {
  const response = await fetch('http://localhost:10767/api/v1/playback/repeat-mode');
  if (!response.ok) {
    throw new Error('Failed to fetch repeat mode');
  }
  return response.json();
};

export const toggleRepeatMode = async () => {
  await fetch('http://localhost:10767/api/v1/playback/toggle-repeat', {
    method: 'POST',
  });
};