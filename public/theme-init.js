(() => {
  try {
    const stored = localStorage.getItem('dl-theme');
    const resolved =
      stored === 'light' || stored === 'dark'
        ? stored
        : matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    document.documentElement.setAttribute('data-theme', resolved);
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
