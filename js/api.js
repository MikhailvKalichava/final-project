export const SAVED_ANIME_KEY_PREFIX = 'savedAnime:';
export const TOP_ANIME_API_URL = 'https://api.jikan.moe/v4/top/anime?limit=6';

export async function fetchData(endpoint) {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Could not load data.');
  }

  return response.json();
}

export function isUserLoggedIn() {
  return Boolean(localStorage.getItem('user'));
}

export function getCurrentAccountId() {
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

export function getSavedAnime() {
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

export function setSavedAnime(animeList) {
  const savedAnimeKey = getSavedAnimeKey();

  if (!savedAnimeKey) {
    return false;
  }

  localStorage.setItem(savedAnimeKey, JSON.stringify(animeList));
  return true;
}

export function isAnimeSaved(animeId) {
  return getSavedAnime().some(anime => anime.id === animeId);
}

export function saveAnime(anime) {
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

export function updateAnimeStatus(animeId, newStatus) {
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

export function removeAnime(animeId) {
  if (!isUserLoggedIn()) {
    return;
  }

  const updatedAnime = getSavedAnime().filter(anime => anime.id !== animeId);
  setSavedAnime(updatedAnime);
}
