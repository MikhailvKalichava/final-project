const SAVED_ANIME_KEY_PREFIX = 'savedAnime:';

async function fetchData(endpoint) {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Could not load data.');
  }

  return response.json();
}

function isUserLoggedIn() {
  return Boolean(localStorage.getItem('user'));
}

function getCurrentAccountId() {
  const currentUser = localStorage.getItem('user');

  if (!currentUser) {
    return null;
  }

  return localStorage.getItem('userEmail') || currentUser;
}

function getSavedAnimeKey() {
  const accountId = getCurrentAccountId();
  return accountId ? `${SAVED_ANIME_KEY_PREFIX}${accountId}` : null;
}

function getSavedAnime() {
  const savedAnimeKey = getSavedAnimeKey();

  if (!savedAnimeKey) {
    return [];
  }

  const savedAnime = localStorage.getItem(savedAnimeKey);

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
  const savedAnimeKey = getSavedAnimeKey();

  if (!savedAnimeKey) {
    return false;
  }

  localStorage.setItem(savedAnimeKey, JSON.stringify(animeList));
  return true;
}

function isAnimeSaved(animeId) {
  return getSavedAnime().some(anime => anime.id === animeId);
}

function saveAnime(anime) {
  if (!isUserLoggedIn()) {
    return false;
  }

  const savedAnime = getSavedAnime();

  if (savedAnime.some(savedItem => savedItem.id === anime.id)) {
    return false;
  }

  const animeWithStatus = {
    ...anime,
    status: anime.status || 'Plan to Watch'
  };

  return setSavedAnime([...savedAnime, animeWithStatus]);
}

function updateAnimeStatus(animeId, newStatus) {
  if (!isUserLoggedIn()) {
    return;
  }

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
  if (!isUserLoggedIn()) {
    return;
  }

  const updatedAnime = getSavedAnime().filter(anime => anime.id !== animeId);
  setSavedAnime(updatedAnime);
}

window.AnimeStorage = {
  fetchData,
  isUserLoggedIn,
  getCurrentAccountId,
  getSavedAnime,
  setSavedAnime,
  isAnimeSaved,
  saveAnime,
  updateAnimeStatus,
  removeAnime
};
