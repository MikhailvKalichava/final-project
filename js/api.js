const SAVED_ANIME_KEY = 'savedAnime';

async function fetchData(endpoint) {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Could not load data.');
  }

  return response.json();
}

function getSavedAnime() {
  const savedAnime = localStorage.getItem(SAVED_ANIME_KEY);

  if (!savedAnime) {
    return [];
  }

  try {
    const parsedAnime = JSON.parse(savedAnime);
    return Array.isArray(parsedAnime) ? parsedAnime : [];
  } catch {
    return [];
  }
}

function setSavedAnime(animeList) {
  localStorage.setItem(SAVED_ANIME_KEY, JSON.stringify(animeList));
}

function isAnimeSaved(animeId) {
  return getSavedAnime().some(anime => anime.id === animeId);
}

function saveAnime(anime) {
  const savedAnime = getSavedAnime();

  if (savedAnime.some(savedItem => savedItem.id === anime.id)) {
    return false;
  }

  const animeWithStatus = {
    ...anime,
    status: anime.status || 'Plan to Watch'
  };

  setSavedAnime([...savedAnime, animeWithStatus]);
  return true;
}

function updateAnimeStatus(animeId, newStatus) {
  const updatedAnime = getSavedAnime().map(anime => {
    if (anime.id === animeId) {
      return {
        ...anime,
        status: newStatus
      };
    }

    return anime;
  });

  setSavedAnime(updatedAnime);
}

function removeAnime(animeId) {
  const updatedAnime = getSavedAnime().filter(anime => anime.id !== animeId);
  setSavedAnime(updatedAnime);
}

window.AnimeStorage = {
  fetchData,
  getSavedAnime,
  setSavedAnime,
  isAnimeSaved,
  saveAnime,
  updateAnimeStatus,
  removeAnime
};