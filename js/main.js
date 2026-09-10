// Applies SITE_CONFIG text/links and renders SELECTIONS_DATA into the page,
// then wires up the mobile nav toggle and the "Rooms" dropdown.
document.addEventListener('DOMContentLoaded', function () {
  applySiteConfig();
  renderSelections();
  setupMobileNav();
  setupNavDropdown();
});

function applySiteConfig() {
  var cfg = SITE_CONFIG;
  setText('[data-site="brand-name"]', cfg.name);
  setText('[data-site="brand-accent"]', cfg.nameAccent);
  setText('[data-site="tagline"]', cfg.tagline);
  setText('[data-site="phone"]', cfg.phone);
  setText('[data-site="email"]', cfg.email);
  setText('[data-site="address"]', cfg.address);
  setText('[data-site="hours"]', cfg.hours);
  setText('[data-site="year"]', cfg.year);
  setText('[data-site="client-name"]', cfg.clientName);
  setText('[data-site="project-name"]', cfg.projectName);
  setText('[data-site="project-address"]', cfg.projectAddress);
  setText('[data-site="presented-date"]', cfg.presentedDate);

  document.querySelectorAll('[data-site-link="phone"]').forEach(function (el) {
    el.setAttribute('href', 'tel:' + String(cfg.phone).replace(/[^\d+]/g, ''));
  });
  document.querySelectorAll('[data-site-link="email"]').forEach(function (el) {
    el.setAttribute('href', 'mailto:' + cfg.email);
  });
  document.querySelectorAll('[data-site-social]').forEach(function (el) {
    var url = cfg.social && cfg.social[el.getAttribute('data-site-social')];
    el.hidden = !url;
    if (url) el.setAttribute('href', url);
  });
}

function setText(selector, value) {
  if (value === undefined || value === null) return;
  document.querySelectorAll(selector).forEach(function (el) { el.textContent = value; });
}

function renderSelections() {
  var data = SELECTIONS_DATA;
  var categories = Object.keys(data);

  document.querySelectorAll('[data-selections-category]').forEach(function (el) {
    var items = data[el.getAttribute('data-selections-category')] || [];
    el.innerHTML = items.length ? items.map(renderSelectionCard).join('') : '<p class="selection-empty">Selections for this room will be added soon.</p>';
  });

  document.querySelectorAll('[data-summary-count]').forEach(function (el) {
    el.textContent = itemsForSummary(el.getAttribute('data-summary-count'), data, categories).length;
  });

  document.querySelectorAll('[data-summary-total]').forEach(function (el) {
    var items = itemsForSummary(el.getAttribute('data-summary-total'), data, categories);
    var total = items.reduce(function (sum, item) { return sum + (Number(item.price) || 0); }, 0);
    el.textContent = formatPrice(total);
  });
}

function itemsForSummary(key, data, categories) {
  if (key === 'all') return categories.reduce(function (all, cat) { return all.concat(data[cat] || []); }, []);
  return data[key] || [];
}

function renderSelectionCard(item) {
  var photo = item.image
    ? '<img class="selection-photo" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '">'
    : '<div class="ph-image ph-image--wide"><span class="ph-label">' + escapeHtml(item.name) + '<br>(replace with your image)</span></div>';

  var metaParts = [];
  if (item.brand) metaParts.push(item.brand);
  if (item.sku) metaParts.push('SKU ' + item.sku);
  var meta = metaParts.length ? '<p class="selection-meta">' + escapeHtml(metaParts.join(' · ')) + '</p>' : '';

  var hasPrice = item.price !== undefined && item.price !== null && item.price !== '';
  var price = hasPrice ? '<p class="selection-price">' + formatPrice(item.price) + '</p>' : '';

  return '<div class="card selection-card">' + photo +
    '<div class="card-body"><h3>' + escapeHtml(item.name) + '</h3>' +
    (item.description ? '<p>' + escapeHtml(item.description) + '</p>' : '') +
    meta + price + '</div></div>';
}

function formatPrice(num) {
  var n = Number(num) || 0;
  return (SITE_CONFIG.currency || '$') + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function setupMobileNav() {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links.classList.contains('open'));
  });
}

function setupNavDropdown() {
  var toggle = document.querySelector('.nav-dropdown-toggle');
  var menu = document.querySelector('.nav-dropdown-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', function () {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
}
