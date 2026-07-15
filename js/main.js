(function () {
  'use strict';

  const config = window.BANTACO_CONFIG;
  const setWhatsapp = (selector, message) => {
    document.querySelectorAll(selector).forEach((link) => {
      link.href = config.whatsappUrl(message);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  };
  setWhatsapp('.js-whatsapp-order', config.messages.order);
  setWhatsapp('.js-whatsapp-banquet', config.messages.banquet);
  setWhatsapp('.js-whatsapp-general', config.messages.general);

  const setExternalLink = (selector, url) => {
    document.querySelectorAll(selector).forEach((link) => {
      if (url) link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  };
  setExternalLink('.js-social-instagram', config.instagram);
  setExternalLink('.js-social-tiktok', config.tiktok);
  setExternalLink('.js-social-facebook', config.facebook);
  setExternalLink('.js-directions', config.directionsUrl);
  setExternalLink('.js-google-maps', config.googleMapsUrl);

  document.querySelectorAll('[data-config="phone"]').forEach((node) => { node.textContent = config.phone || 'Por confirmar'; });
  document.querySelectorAll('[data-config="address"]').forEach((node) => { node.textContent = config.address || 'Dirección por confirmar'; });

  const map = document.querySelector('.js-map-embed');
  if (map && config.mapEmbedUrl) map.src = config.mapEmbedUrl;

  const schema = document.getElementById('restaurantSchema');
  if (schema) {
    const website = config.websiteUrl || 'https://TU-USUARIO.github.io/TU-REPOSITORIO/';
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: config.businessName,
      description: 'Taquería y servicio de banquetes en Aguascalientes.',
      telephone: `+${config.whatsapp}`,
      servesCuisine: ['Mexicana', 'Tacos'],
      priceRange: '$$',
      url: website,
      image: `${website.replace(/\/$/, '')}/assets/images/site/hero-1600.jpg`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Aguascalientes',
        addressRegion: 'Aguascalientes',
        addressCountry: 'MX'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: config.latitude,
        longitude: config.longitude
      },
      hasMenu: `${website.replace(/\/$/, '')}/#menu`,
      sameAs: [config.instagram, config.tiktok, config.facebook]
    };
    schema.textContent = JSON.stringify(data);
  }

  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('[data-game-toggle]').forEach((toggle) => {
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    const label = toggle.querySelector('.toggle-label');
    const game = toggle.dataset.gameToggle;
    toggle.addEventListener('click', () => {
      const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(willOpen));
      panel.hidden = !willOpen;
      label.textContent = willOpen ? 'Cerrar juego' : (game === 'catch' ? 'Abrir Atrapa los tacos' : 'Abrir Taco Runner');
      window.dispatchEvent(new CustomEvent(willOpen ? 'bantaco:game-open' : 'bantaco:game-close', { detail: { game } }));
      if (willOpen) panel.querySelector('canvas')?.focus({ preventScroll: true });
    });
  });
})();
