const navUser = document.getElementById('nav-user');
const loginLink = document.getElementById('login-link');
const logoutBtn = document.getElementById('logout-btn');
const savedGrid = document.getElementById('saved-grid');
const savedEmpty = document.getElementById('saved-empty');

function updateHeader() {
  const currentUser = localStorage.getItem('user');

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

function createCategoryTags(categories) {
  const categoryBox = document.createElement('div');
  categoryBox.className = 'saved-card__categories';
  categoryBox.setAttribute('aria-label', 'Anime categories');

  categories.forEach(category => {
    const tag = document.createElement('span');
    tag.textContent = category;
    categoryBox.appendChild(tag);
  });

  return categoryBox;
}

function createStatusSelect(anime) {
  const label = document.createElement('label');
  label.className = 'saved-card__status-label';
  label.textContent = 'Status';

  const select = document.createElement('select');
  select.className = 'saved-card__status';
  select.name = `${anime.id}-status`;

  const statuses = ['Watching', 'Plan to Watch', 'Completed', 'On Hold', 'Dropped'];

  statuses.forEach(status => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;

    if (anime.status === status) {
      option.selected = true;
    }

    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    window.AnimeStorage.updateAnimeStatus(anime.id, select.value);
  });

  label.appendChild(select);
  return label;
}

function createRemoveButton(anime) {
  const removeButton = document.createElement('button');
  removeButton.className = 'saved-card__remove-btn';
  removeButton.type = 'button';
  removeButton.textContent = 'Remove';

  removeButton.addEventListener('click', () => {
    window.AnimeStorage.removeAnime(anime.id);
    renderSavedAnime();
  });

  return removeButton;
}

function createSavedCard(anime) {
  const card = document.createElement('article');
  card.className = 'saved-card';
  card.dataset.animeId = anime.id;

  const image = document.createElement('img');
  image.className = 'saved-card__image';
  image.src = anime.image;
  image.alt = `Placeholder image for ${anime.title}`;

  const content = document.createElement('div');
  content.className = 'saved-card__content';

  const title = document.createElement('h3');
  title.className = 'saved-card__title';
  title.textContent = anime.title;

  const details = document.createElement('details');
  details.className = 'saved-card__description';

  const summary = document.createElement('summary');
  summary.textContent = 'Description';

  const description = document.createElement('p');
  description.textContent = anime.description;

  details.appendChild(summary);
  details.appendChild(description);
  content.appendChild(title);
  content.appendChild(details);

  const meta = document.createElement('div');
  meta.className = 'saved-card__meta';
  meta.appendChild(createCategoryTags(anime.categories));
  meta.appendChild(createStatusSelect(anime));
  meta.appendChild(createRemoveButton(anime));

  card.appendChild(image);
  card.appendChild(content);
  card.appendChild(meta);

  return card;
}

function renderSavedAnime() {
  const savedAnime = window.AnimeStorage.getSavedAnime();
  savedGrid.innerHTML = '';

  if (!savedAnime.length) {
    savedEmpty.hidden = false;
    return;
  }

  savedEmpty.hidden = true;

  savedAnime.forEach(anime => {
    const card = createSavedCard(anime);
    savedGrid.appendChild(card);
  });
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  window.location.href = 'login.html';
});

updateHeader();
renderSavedAnime();
