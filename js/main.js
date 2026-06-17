const currentUser = localStorage.getItem('user');
const navUser = document.getElementById('nav-user');
const loginLink = document.getElementById('login-link');
const logoutBtn = document.getElementById('logout-btn');
const saveButtons = document.querySelectorAll('.anime-card__save-btn');

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

function updateSaveButtonStates() {
  saveButtons.forEach(button => {
    const card = button.closest('.anime-card');

    if (!window.AnimeStorage.isUserLoggedIn()) {
      markButtonForGuest(button);
      return;
    }

    if (window.AnimeStorage.isAnimeSaved(card.dataset.animeId)) {
      markButtonAsSaved(button);
    }
  });
}

function showSaveMessage(card, message) {
  const messageEl = card.querySelector('.anime-card__message');
  messageEl.textContent = message;
  messageEl.hidden = false;
}

function handleSaveButtons() {
  saveButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.anime-card');

      if (!window.AnimeStorage.isUserLoggedIn()) {
        showSaveMessage(card, 'Please log in before saving anime.');
        return;
      }

      const anime = getAnimeFromCard(card);
      const wasSaved = window.AnimeStorage.saveAnime(anime);

      if (wasSaved) {
        markButtonAsSaved(button);
        showSaveMessage(card, 'Added to Saved Anime.');
      } else {
        showSaveMessage(card, 'This anime is already saved.');
      }
    });
  });
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userEmail');
  document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  window.location.href = 'login.html';
});

updateHeader();
updateSaveButtonStates();
handleSaveButtons();
