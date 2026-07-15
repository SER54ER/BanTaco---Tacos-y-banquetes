(function () {
  'use strict';

  const gallery = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const title = document.getElementById('lightboxTitle');
  const prev = lightbox.querySelector('.lightbox-prev');
  const next = lightbox.querySelector('.lightbox-next');
  const closeButtons = lightbox.querySelectorAll('[data-lightbox-close]');
  const items = [
    { src: 'assets/images/site/equipo-bantaco-1200.jpg', alt: 'Equipo de Ban Taco atendiendo y preparando pedidos', title: 'Equipo Ban Taco' },
    { src: 'assets/images/site/salon-bantaco-1200.jpg', alt: 'Salón de Ban Taco con mesas para clientes', title: 'Salón Ban Taco' },
    { src: 'assets/images/site/fachada-bantaco-1200.jpg', alt: 'Fachada exterior del restaurante Ban Taco', title: 'Fachada Ban Taco' }
  ];
  let index = 0;
  let previousFocus = null;

  function show(newIndex) {
    index = (newIndex + items.length) % items.length;
    image.src = items[index].src;
    image.alt = items[index].alt;
    title.textContent = items[index].title;
  }

  function open(newIndex) {
    previousFocus = document.activeElement;
    show(newIndex);
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function close() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    image.src = '';
    document.body.style.overflow = '';
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  gallery.addEventListener('click', (event) => {
    const button = event.target.closest('[data-index]');
    if (button) open(Number(button.dataset.index));
  });
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  closeButtons.forEach((button) => button.addEventListener('click', close));

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
    if (event.key === 'Tab') {
      const focusables = [lightbox.querySelector('.lightbox-close'), prev, next];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
