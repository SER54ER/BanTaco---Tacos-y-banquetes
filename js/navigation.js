(function () {
  'use strict';

  const toggle = document.getElementById('menuToggle');
  const closeButton = document.getElementById('menuClose');
  const menu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');
  const mobileLinks = Array.from(menu.querySelectorAll('a[href^="#"]'));
  const desktopLinks = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
  let previousFocus = null;

  function focusableItems() {
    return Array.from(menu.querySelectorAll('a[href], button:not([disabled])')).filter((item) => !item.hidden);
  }

  function openMenu() {
    previousFocus = document.activeElement;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    backdrop.hidden = false;
    document.body.classList.add('menu-open');
    closeButton.focus();
  }

  function closeMenu({ restoreFocus = true } = {}) {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    backdrop.hidden = true;
    document.body.classList.remove('menu-open');
    if (restoreFocus && previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  closeButton.addEventListener('click', () => closeMenu());
  backdrop.addEventListener('click', () => closeMenu());
  mobileLinks.forEach((link) => link.addEventListener('click', () => closeMenu({ restoreFocus: false })));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (menu.classList.contains('open')) closeMenu();
      document.querySelectorAll('.more-menu[open]').forEach((details) => details.removeAttribute('open'));
    }
    if (event.key !== 'Tab' || !menu.classList.contains('open')) return;
    const items = focusableItems();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.more-menu[open]').forEach((details) => {
      if (!details.contains(event.target)) details.removeAttribute('open');
    });
  });

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const allNavLinks = [...mobileLinks, ...desktopLinks];
  function setActive(id) {
    allNavLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.01, 0.15, 0.4] });
    sections.forEach((section) => observer.observe(section));
  }
})();
