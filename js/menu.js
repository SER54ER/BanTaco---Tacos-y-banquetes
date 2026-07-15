(function () {
  'use strict';

  const menu = Array.isArray(window.BANTACO_MENU) ? window.BANTACO_MENU : [];
  const categories = window.BANTACO_CATEGORIES || {};
  const grid = document.getElementById('menuGrid');
  const highlights = document.getElementById('highlightGrid');
  const tabs = document.getElementById('categoryTabs');
  const search = document.getElementById('menuSearch');
  const clear = document.getElementById('clearSearch');
  const reset = document.getElementById('resetMenu');
  const empty = document.getElementById('menuEmpty');
  const status = document.getElementById('menuStatus');
  const form = document.getElementById('menuSearchForm');
  let activeCategory = 'destacados';

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[character]));
  }

  function normalize(value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function imageMarkup(item, sizes) {
    const alt = `Platillo ${escapeHTML(item.title)} de Ban Taco`;
    return `<picture>
      <source srcset="${item.image}-480.webp 480w, ${item.image}-800.webp 800w" type="image/webp" sizes="${sizes}">
      <img src="${item.image}-800.jpg" width="800" height="600" alt="${alt}" loading="lazy" decoding="async">
    </picture>`;
  }

  function productCard(item) {
    return `<article class="product-card" id="producto-${escapeHTML(item.id)}" data-id="${escapeHTML(item.id)}">
      <div class="product-media">${imageMarkup(item, '(max-width: 760px) 132px, (max-width: 1120px) 33vw, 25vw')}</div>
      <div class="product-body">
        <div class="product-heading">
          <h3>${escapeHTML(item.title)}</h3>
          <span class="product-price">${escapeHTML(item.price)}</span>
        </div>
        <p class="product-description">${escapeHTML(item.description)}</p>
      </div>
    </article>`;
  }

  function highlightCard(item) {
    const label = item.etiqueta ? `<span class="favorite-tag">${escapeHTML(item.etiqueta)}</span>` : '';
    return `<article class="favorite-card">
      <div class="favorite-media">${imageMarkup(item, '(max-width: 430px) 100vw, (max-width: 760px) 50vw, 28vw')}${label}</div>
      <div class="favorite-content">
        <div class="favorite-heading"><h3>${escapeHTML(item.title)}</h3><strong>${escapeHTML(item.price)}</strong></div>
        <p>${escapeHTML(item.description)}</p>
        <div class="favorite-actions">
          <a class="btn btn-secondary" href="#producto-${escapeHTML(item.id)}" aria-label="Ver ${escapeHTML(item.title)} en el menú">Ver en el menú</a>
        </div>
      </div>
    </article>`;
  }

  function isFeatured(item) {
    return item.destacado === true;
  }

  function buildTabs() {
    const items = [
      ['destacados', 'Destacados'],
      ['todo', 'Todo'],
      ...Object.entries(categories)
    ];
    tabs.innerHTML = items.map(([key, label]) => `<button class="category-tab${key === activeCategory ? ' active' : ''}" type="button" data-category="${key}" aria-pressed="${key === activeCategory}">${escapeHTML(label)}</button>`).join('');
  }

  function filteredItems() {
    const query = normalize(search.value);
    return menu.filter((item) => {
      const categoryMatch = activeCategory === 'todo' || (activeCategory === 'destacados' ? isFeatured(item) : item.category === activeCategory);
      if (!categoryMatch) return false;
      if (!query) return true;
      const haystack = normalize(`${item.title} ${item.description} ${item.category} ${categories[item.category] || ''}`);
      return haystack.includes(query);
    });
  }

  function render() {
    const items = filteredItems();
    grid.innerHTML = items.map(productCard).join('');
    const queryText = search.value.trim();
    const categoryName = activeCategory === 'destacados' ? 'Destacados' : activeCategory === 'todo' ? 'Todo el menú' : categories[activeCategory] || activeCategory;
    status.textContent = `${items.length} ${items.length === 1 ? 'producto' : 'productos'} · ${categoryName}${queryText ? ` · búsqueda: “${queryText}”` : ''}`;
    empty.hidden = items.length !== 0;
    grid.hidden = items.length === 0;
  }

  function resetAll() {
    activeCategory = 'todo';
    search.value = '';
    buildTabs();
    render();
    search.focus();
  }

  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    tabs.querySelectorAll('.category-tab').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  });
  search.addEventListener('input', () => {
    if (search.value.trim() && activeCategory !== 'todo') {
      activeCategory = 'todo';
      buildTabs();
    }
    render();
  });
  clear.addEventListener('click', () => { search.value = ''; render(); search.focus(); });
  reset.addEventListener('click', resetAll);
  form.addEventListener('submit', (event) => event.preventDefault());

  highlights.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#producto-"]');
    if (!link) return;
    if (activeCategory !== 'destacados') {
      activeCategory = 'destacados';
      buildTabs();
      render();
    }
  });

  buildTabs();
  render();
  highlights.innerHTML = menu.filter(isFeatured).slice(0, 6).map(highlightCard).join('');
})();
