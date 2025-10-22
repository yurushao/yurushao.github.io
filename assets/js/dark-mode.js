// Dark mode toggle functionality
(function() {
  'use strict';

  // Get theme from localStorage or default to light
  function getTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Set theme
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // Initialize theme on page load
  document.addEventListener('DOMContentLoaded', function() {
    const theme = getTheme();
    setTheme(theme);

    // Add click handler to toggle button
    const toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }
  });

  // Set theme immediately to prevent flash
  setTheme(getTheme());

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();
