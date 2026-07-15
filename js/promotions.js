(function () {
  'use strict';

  const section = document.getElementById('promociones');
  const grid = document.getElementById('promotionsGrid');
  const data = Array.isArray(window.BANTACO_PROMOTIONS) ? window.BANTACO_PROMOTIONS : [];
  const config = window.BANTACO_CONFIG;
  if (!section || !grid) return;

  function todayInTimezone() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: config.timezone, year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date()).map((part) => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function validDate(value) {
    return value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  function isCurrent(item, today) {
    if (item.activa !== true || !validDate(item.fechaInicio || '') || !validDate(item.fechaFin || '')) return false;
    if (item.fechaInicio && today < item.fechaInicio) return false;
    if (item.fechaFin && today > item.fechaFin) return false;
    return true;
  }

  function safeUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value, window.location.href);
      if (['http:', 'https:'].includes(url.protocol)) return url.href;
    } catch (_) {}
    return '';
  }

  function safeImage(value) {
    if (!value) return '';
    if (/^(assets\/|\.\/assets\/)[A-Za-z0-9_./-]+\.(avif|webp|png|jpe?g)$/i.test(value)) return value;
    return safeUrl(value);
  }

  function createCard(item) {
    const article = document.createElement('article');
    article.className = 'promotion-card';

    const image = safeImage(String(item.imagen || '').trim());
    if (image) {
      const media = document.createElement('div');
      media.className = 'promotion-media';
      const img = document.createElement('img');
      img.src = image;
      img.alt = String(item.imagenAlt || item.titulo || 'Promoción de Ban Taco');
      img.width = 800;
      img.height = 600;
      img.loading = 'lazy';
      img.decoding = 'async';
      media.append(img);
      article.append(media);
    }

    const body = document.createElement('div');
    body.className = 'promotion-body';
    const title = document.createElement('h3');
    title.textContent = String(item.titulo || 'Promoción');
    const description = document.createElement('p');
    description.textContent = String(item.descripcion || '');
    body.append(title, description);

    const buttonText = String(item.botonTexto || '').trim();
    if (buttonText) {
      let href = '';
      if (item.tipoEnlace === 'whatsapp') {
        href = config.whatsappUrl(String(item.mensajeWhatsApp || config.messages.general));
      } else {
        href = safeUrl(String(item.enlace || '').trim());
      }
      if (href) {
        const link = document.createElement('a');
        link.className = item.tipoEnlace === 'whatsapp' ? 'btn btn-whatsapp' : 'btn btn-primary';
        link.textContent = buttonText;
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        body.append(link);
      }
    }

    article.append(body);
    return article;
  }

  const active = data.filter((item) => item && typeof item === 'object' && isCurrent(item, todayInTimezone()));
  if (!active.length) {
    section.hidden = true;
    return;
  }

  grid.replaceChildren(...active.map(createCard));
  section.hidden = false;
})();
