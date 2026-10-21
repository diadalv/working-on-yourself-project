(() => {
  'use strict';
  // Image failure handling lives here so inline event handlers stay disabled.
  document.querySelectorAll('img').forEach(img => {
    const showFallback = () => {
      const frame = img.closest('.photo-frame, .loc-photo');
      if (frame) frame.classList.add('img-missing');
    };
    img.addEventListener('error', showFallback);
    if (img.complete && img.naturalWidth === 0) showFallback();
  });
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const sticky = document.getElementById('mobileStickyCta');
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Άνοιγμα μενού');
    drawer.classList.remove('is-open');
    drawer.inert = true;
  };
  closeMenu();
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού');
    drawer.classList.toggle('is-open', open);
    drawer.inert = !open;
    if (open) sticky.classList.remove('is-visible');
  });
  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', closeMenu);
  document.getElementById('year').textContent = new Date().getFullYear();
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    const hero = document.getElementById('hero').getBoundingClientRect();
    const booking = document.getElementById('booking').getBoundingClientRect();
    sticky.classList.toggle('is-visible', hero.bottom < 0 && booking.top > window.innerHeight && toggle.getAttribute('aria-expanded') !== 'true');
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  // One quiet bloom per illustration; static artwork is the default fallback.
  const flowers = document.querySelectorAll('.brand-flower');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let bloomObserver;
  if (!motion.matches && 'IntersectionObserver' in window) {
    bloomObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-waiting');
        entry.target.classList.add('is-blooming');
        bloomObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    flowers.forEach(flower => {
      flower.classList.add('is-waiting');
      bloomObserver.observe(flower);
    });
  }
  motion.addEventListener('change', event => {
    if (!event.matches) return;
    if (bloomObserver) bloomObserver.disconnect();
    flowers.forEach(flower => flower.classList.remove('is-waiting', 'is-blooming'));
  });
})();
