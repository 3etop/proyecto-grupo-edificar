document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      history.pushState(null, '', link.getAttribute('href'));
    });
  });

  function setMenuOpen(isOpen) {
    if (!hamburger || !navMenu) return;
    navMenu.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  }

  hamburger?.addEventListener('click', () => {
    setMenuOpen(hamburger.getAttribute('aria-expanded') !== 'true');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visibleSection = entries
        .filter(entry => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (visibleSection) {
        navLinks.forEach(link => {
          const isActive = link.hash === `#${visibleSection.target.id}`;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { threshold: [0.2, 0.5, 0.8] });

    sections.forEach(section => sectionObserver.observe(section));

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll(
      '.section-heading, .purpose-item, .clients-details, .product-card, .partners-heading, .partner-item, .partners-link, .ebikes-inner > *, .contact-inner > *'
    );

    if (!reducedMotion && revealElements.length) {
      revealElements.forEach(element => element.classList.add('reveal-on-scroll'));
      document.documentElement.classList.add('reveal-ready');

      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.16, rootMargin: '0px 0px -36px 0px' });

      revealElements.forEach(element => revealObserver.observe(element));
    }
  }

});