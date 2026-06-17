const THEME_KEY = 'pageTheme';
const DEFAULT_THEME = 'dark';
const AVAILABLE_THEMES = ['dark', 'rose'];

export function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  return AVAILABLE_THEMES.includes(savedTheme) ? savedTheme : DEFAULT_THEME;
}

export function applyTheme(themeName) {
  const safeTheme = AVAILABLE_THEMES.includes(themeName) ? themeName : DEFAULT_THEME;
  document.documentElement.dataset.theme = safeTheme;
  localStorage.setItem(THEME_KEY, safeTheme);
  return safeTheme;
}

export function initThemeSwitcher() {
  const themeSelect = document.getElementById('theme-select');
  const activeTheme = applyTheme(getSavedTheme());

  if (!themeSelect) {
    return;
  }

  themeSelect.value = activeTheme;

  themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value);
  });
}
