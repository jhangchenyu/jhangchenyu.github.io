(() => {
  'use strict';

  const root = document.documentElement;
  const toggle = document.querySelector('.motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'chen-yu-motion-paused';
  const activeAnimations = new Set();
  const seen = new WeakSet();
  let manuallyPaused = false;
  let printing = false;
  try { manuallyPaused = localStorage.getItem(storageKey) === 'true'; } catch { /* Storage is optional. */ }

  const enabled = () => !preference.matches && !manuallyPaused && !printing;
  const cancelEntries = () => {
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations.clear();
  };

  function syncMotion() {
    root.classList.toggle('motion-enabled', enabled());
    root.classList.toggle('motion-suspended', document.hidden);
    if (!enabled() || document.hidden) cancelEntries();
    if (!toggle) return;
    toggle.hidden = false;
    toggle.disabled = preference.matches;
    toggle.textContent = preference.matches ? '已減少動態' : manuallyPaused ? '播放動畫' : '暫停動畫';
    toggle.title = preference.matches ? '已依照你的系統設定減少動態效果' : '控制網站動畫';
  }

  function enter(element, delay = 0) {
    if (seen.has(element)) return;
    seen.add(element);
    if (!enabled() || document.hidden || typeof element.animate !== 'function') return;
    const animation = element.animate([
      { opacity: 0.25, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 620, delay, fill: 'backwards', easing: 'cubic-bezier(.22, 1, .36, 1)' });
    activeAnimations.add(animation);
    animation.onfinish = animation.oncancel = () => activeAnimations.delete(animation);
  }

  toggle?.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    try { localStorage.setItem(storageKey, String(manuallyPaused)); } catch { /* The toggle still works without storage. */ }
    syncMotion();
  });
  preference.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('beforeprint', () => { printing = true; syncMotion(); });
  window.addEventListener('afterprint', () => { printing = false; syncMotion(); });
  // Keep a second tab in sync without requiring browser storage for the site to work.
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      manuallyPaused = event.newValue === 'true';
      syncMotion();
    }
  });
  // Without an observer the diagram stays static, including in older browsers.
  root.classList.add('diagram-offscreen');
  syncMotion();

  document.querySelectorAll('.hero > div > *, .science-figure, .page-intro > *')
    .forEach((element, index) => enter(element, Math.min(index * 65, 260)));

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        enter(entry.target);
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.content-section, .research-section, .workflow li')
      .forEach(element => reveal.observe(element));

    const figure = document.querySelector('.science-figure');
    if (figure) {
      const visibility = new IntersectionObserver(([entry]) => {
        root.classList.toggle('diagram-offscreen', !entry.isIntersecting);
      });
      visibility.observe(figure);
    }
  }
})();
