import {
  TOP_ANIME_API_URL,
  fetchData,
  isUserLoggedIn,
  isAnimeSaved,
  saveAnime
} from './api.js';

const currentUser = localStorage.getItem('user');
const navUser = document.getElementById('nav-user');
const loginLink = document.getElementById('login-link');
const logoutBtn = document.getElementById('logout-btn');
const staticSaveButtons = document.querySelectorAll('.anime-card__save-btn');
const apiResultsGrid = document.getElementById('api-results-grid');
const loadingMsg = document.getElementById('loading-msg');
const errorMsg = document.getElementById('error-msg');

let liveAnimeResults = [];

function updateHeader() {
  if (currentUser) {
    navUser.textContent = `Hello, ${currentUser}`;
    loginLink.hidden = true;
    logoutBtn.hidden = false;
  } else {
    navUser.textContent = 'Guest';
    loginLink.hidden = false;
    logoutBtn.hidden = true;
  }
}

function getAnimeFromCard(card) {
  return {
    id: card.dataset.animeId,
    title: card.dataset.animeTitle,
    description: card.dataset.animeDescription,
    categories: card.dataset.animeCategories.split(',').map(category => category.trim()),
    image: card.dataset.animeImage
  };
}

function markButtonAsSaved(button) {
  button.textContent = 'Saved';
  button.disabled = true;
}

function markButtonForGuest(button) {
  button.textContent = 'Login to Save';
}

function showSaveMessage(card, message) {
  const messageEl = card.querySelector('.anime-card__message');
  messageEl.textContent = message;
  messageEl.hidden = false;
}

function updateOneSaveButton(button, animeId) {
  if (!isUserLoggedIn()) {
    markButtonForGuest(button);
    return;
  }

  if (isAnimeSaved(animeId)) {
    markButtonAsSaved(button);
  }
}

function updateStaticSaveButtonStates() {
  staticSaveButtons.forEach(button => {
    const card = button.closest('.anime-card');
    updateOneSaveButton(button, card.dataset.animeId);
  });
}

function saveAnimeFromButton(button, anime, card) {
  if (!isUserLoggedIn()) {
    showSaveMessage(card, 'Please log in before saving anime.');
    return;
  }

  const wasSaved = saveAnime(anime);

  if (wasSaved) {
    markButtonAsSaved(button);
    showSaveMessage(card, 'Added to Saved Anime.');
  } else {
    showSaveMessage(card, 'This anime is already saved.');
  }
}

function handleStaticSaveButtons() {
  staticSaveButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.anime-card');
      const anime = getAnimeFromCard(card);
      saveAnimeFromButton(button, anime, card);
    });
  });
}

function showLoading() {
  loadingMsg.hidden = false;
  errorMsg.hidden = true;
  errorMsg.textContent = '';
}

function hideLoading() {
  loadingMsg.hidden = true;
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}

function getApiAnimeCategories(apiAnime) {
  const genres = Array.isArray(apiAnime.genres) ? apiAnime.genres : [];
  const categories = genres.map(genre => genre.name).filter(Boolean);
  return categories.length ? categories.slice(0, 3) : ['Anime'];
}

function normalizeApiAnime(apiAnime) {
  const categories = getApiAnimeCategories(apiAnime);

  return {
    id: `api-${apiAnime.mal_id}`,
    title: apiAnime.title_english || apiAnime.title,
    description: apiAnime.synopsis || 'No description available from the API.',
    categories,
    image: apiAnime.images?.jpg?.image_url || 'assets/anime-placeholder.svg'
  };
}

function createCategoryTags(categories) {
  const categoryBox = document.createElement('div');
  categoryBox.className = 'anime-card__categories';
  categoryBox.setAttribute('aria-label', 'Anime categories');

  categories.forEach(category => {
    const tag = document.createElement('span');
    tag.textContent = category;
    categoryBox.appendChild(tag);
  });

  return categoryBox;
}

function createApiAnimeCard(anime) {
  const card = document.createElement('article');
  card.className = 'anime-card anime-card--api';
  card.dataset.animeId = anime.id;

  const image = document.createElement('img');
  image.className = 'anime-card__image';
  image.src = anime.image;
  image.alt = `Poster image for ${anime.title}`;

  const content = document.createElement('div');
  content.className = 'anime-card__content';

  const title = document.createElement('h3');
  title.className = 'anime-card__title';
  title.textContent = anime.title;

  const details = document.createElement('details');
  details.className = 'anime-card__description';

  const summary = document.createElement('summary');
  summary.textContent = 'Description';

  const description = document.createElement('p');
  description.textContent = anime.description;

  details.appendChild(summary);
  details.appendChild(description);
  content.appendChild(title);
  content.appendChild(details);

  const meta = document.createElement('div');
  meta.className = 'anime-card__meta';
  meta.appendChild(createCategoryTags(anime.categories));

  const saveButton = document.createElement('button');
  saveButton.className = 'anime-card__save-btn';
  saveButton.type = 'button';
  saveButton.textContent = 'Save';
  updateOneSaveButton(saveButton, anime.id);

  const message = document.createElement('p');
  message.className = 'anime-card__message';
  message.hidden = true;

  saveButton.addEventListener('click', () => {
    saveAnimeFromButton(saveButton, anime, card);
  });

  meta.appendChild(saveButton);
  meta.appendChild(message);

  card.appendChild(image);
  card.appendChild(content);
  card.appendChild(meta);

  return card;
}

function renderApiAnime(items) {
  apiResultsGrid.innerHTML = '';

  items.forEach(item => {
    const card = createApiAnimeCard(item);
    apiResultsGrid.appendChild(card);
  });
}

async function loadTopAnimeFromApi() {
  showLoading();

  try {
    const responseData = await fetchData(TOP_ANIME_API_URL);
    liveAnimeResults = responseData.data.map(normalizeApiAnime);
    renderApiAnime(liveAnimeResults);
  } catch (error) {
    showError('Could not load live anime data. Please check your internet connection and try again.');
  } finally {
    hideLoading();
  }
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userEmail');
  document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  window.location.href = 'login.html';
});

updateHeader();
updateStaticSaveButtonStates();
handleStaticSaveButtons();
loadTopAnimeFromApi();
