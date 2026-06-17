import { initThemeSwitcher } from './theme.js';

const accountForm = document.getElementById('account-form');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const photoInput = document.getElementById('photo-input');
const joinedInput = document.getElementById('joined-input');
const messageEl = document.getElementById('account-message');

const defaultProfile = {
  name: localStorage.getItem('user') || 'Anime Fan',
  email: localStorage.getItem('userEmail') || 'animefan@example.com',
  photo: '',
  joinedDate: ''
};

function getProfile() {
  const savedProfile = localStorage.getItem('accountProfile');
  return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
}

function fillProfileForm(profile) {
  nameInput.value = profile.name;
  emailInput.value = profile.email;
  photoInput.value = profile.photo;
  joinedInput.value = profile.joinedDate;
}

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.hidden = false;
  messageEl.className = isError ? 'account-form__message account-form__message--error' : 'account-form__message';
}

function saveProfile(profile) {
  localStorage.setItem('accountProfile', JSON.stringify(profile));
  localStorage.setItem('user', profile.name);
  localStorage.setItem('userEmail', profile.email);
  document.cookie = 'authorized=true; path=/';
}

initThemeSwitcher();
fillProfileForm(getProfile());

accountForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!accountForm.checkValidity()) {
    showMessage('Please fill in the required fields correctly.', true);
    return;
  }

  const profile = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    photo: photoInput.value.trim(),
    joinedDate: joinedInput.value
  };

  saveProfile(profile);
  showMessage('Account changes saved.');
});
