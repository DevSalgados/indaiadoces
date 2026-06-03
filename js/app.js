/* ─── State ──────────────────────────────────────────────────────────────── */
const state = {
  filtered:        PRODUCTS.slice(),
  selected:        [],          // product ids
  activeCategory:  'all',
  activeProfiles:  [],
  searchQuery:     '',
  currentModalId:  null,
  menuOpen:        false,
  drawerOpen:      false,
};

/* ─── DOM Refs ───────────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const DOM = {
  header:         $('header'),
  productGrid:    $('product-grid'),
  emptyState:     $('empty-state'),
  filterSummary:  $('filter-summary'),
  filterCount:    $('filter-count'),
  searchInput:    $('search-input'),
  searchClear:    $('search-clear'),
  headerCount:    $('header-count'),
  fab:            $('fab'),
  fabCount:       $('fab-count'),
  toast:          $('toast'),
  // modal
  modalOverlay:   $('modal-overlay'),
  modalVisual:    $('modal-visual'),
  modalCategory:  $('modal-category'),
  modalTag:       $('modal-tag'),
  modalTitle:     $('modal-title'),
  modalDesc:      $('modal-desc'),
  modalHighlights:$('modal-highlights'),
  modalUsage:     $('modal-usage'),
  modalAddBtn:    $('modal-add-btn'),
  modalWhatsapp:  $('modal-whatsapp-btn'),
  modalClose:     $('modal-close'),
  // drawer
  drawerOverlay:  $('drawer-overlay'),
  drawer:         $('selection-drawer'),
  drawerClose:    $('drawer-close'),
  drawerItems:    $('drawer-items'),
  drawerEmpty:    $('drawer-empty'),
  drawerForm:     $('drawer-form'),
  sendWhatsapp:   $('send-whatsapp-btn'),
  clearSelection: $('clear-selection-btn'),
  formName:       $('form-name'),
  formDate:       $('form-date'),
  formGuests:     $('form-guests'),
  formNotes:      $('form-notes'),
  // other
  menuToggle:     $('menu-toggle'),
  mobileNav:      $('mobile-nav'),
  clearFilters:   $('clear-filters'),
  emptyClearBtn:  $('empty-clear-btn'),
};

/* ─── Tag class map ──────────────────────────────────────────────────────── */
const TAG_CLASS = {
  premium:  'tag-premium',
  trend:    'tag-trend',
  classic:  'tag-classic',
  refresh:  'tag-refresh',
  artisan:  'tag-artisan',
  elegant:  'tag-elegant',
  favorite: 'tag-favorite',
};

/* ─── WhatsApp URL builder ───────────────────────────────────────────────── */
function buildWhatsappUrl(message) {
  const base = `https://wa.me/${CONFIG.whatsapp}`;
  return `${base}?text=${encodeURIComponent(message)}`;
}

function genericWhatsappUrl() {
  const msg = `Olá! Vim pelo catálogo digital da ${CONFIG.brandName} ${CONFIG.brandSub} e gostaria de saber mais sobre os doces disponíveis para meu evento. Podem me ajudar? 😊`;
  return buildWhatsappUrl(msg);
}

function buildSelectionMessage() {
  const items = state.selected.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const name   = (DOM.formName.value   || '').trim();
  const date   = (DOM.formDate.value   || '').trim();
  const guests = (DOM.formGuests.value || '').trim();
  const notes  = (DOM.formNotes.value  || '').trim();

  if (!items.length) return genericWhatsappUrl();

  let msg = `Olá! Gostaria de solicitar um orçamento de doces finos para meu evento. 🍫✨\n\n`;
  msg += `*Seleção de doces de interesse:*\n`;
  items.forEach((p, i) => {
    msg += `${i + 1}. ${p.name} (${p.categoryLabel})\n`;
  });

  if (name || date || guests || notes) {
    msg += `\n*Informações do evento:*\n`;
    if (name)   msg += `• Nome: ${name}\n`;
    if (date)   msg += `• Data: ${formatDate(date)}\n`;
    if (guests) msg += `• Estimativa de convidados: ${guests}\n`;
    if (notes)  msg += `• Observações: ${notes}\n`;
  }

  msg += `\nAguardo retorno. Obrigado(a)!`;
  return buildWhatsappUrl(msg);
}

function singleProductUrl(product) {
  const msg = `Olá! Vi o *${product.name}* no catálogo da ${CONFIG.brandName} e gostaria de saber mais sobre disponibilidade e valores. Podem me ajudar?`;
  return buildWhatsappUrl(msg);
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/* ─── Filtering ──────────────────────────────────────────────────────────── */
function applyFilters() {
  const { activeCategory, activeProfiles, searchQuery } = state;
  const q = searchQuery.toLowerCase();

  state.filtered = PRODUCTS.filter(p => {
    const matchCat     = activeCategory === 'all' || p.category === activeCategory;
    const matchProfile = !activeProfiles.length || activeProfiles.some(pr => p.profiles.includes(pr));
    const matchSearch  = !q || [p.name, p.shortDesc, p.fullDesc, ...(p.highlights || []), p.searchTerms]
      .join(' ').toLowerCase().includes(q);
    return matchCat && matchProfile && matchSearch;
  });

  renderGrid();
  renderFilterSummary();
}

function renderFilterSummary() {
  const { activeCategory, activeProfiles, searchQuery, filtered } = state;
  const hasFilter = activeCategory !== 'all' || activeProfiles.length || searchQuery;

  if (hasFilter) {
    DOM.filterSummary.hidden = false;
    const n = filtered.length;
    DOM.filterCount.textContent = n === 0 ? 'Nenhum produto encontrado'
      : n === 1 ? '1 produto encontrado'
      : `${n} produtos encontrados`;
  } else {
    DOM.filterSummary.hidden = true;
  }
}

/* ─── Grid Rendering ─────────────────────────────────────────────────────── */
function renderGrid() {
  const { filtered, selected } = state;

  DOM.emptyState.hidden    = filtered.length > 0;
  DOM.productGrid.hidden   = filtered.length === 0;

  if (!filtered.length) {
    DOM.productGrid.innerHTML = '';
    return;
  }

  DOM.productGrid.innerHTML = filtered.map(p => renderCard(p, selected.includes(p.id))).join('');

  // Bind card events
  DOM.productGrid.querySelectorAll('.product-card').forEach(card => {
    const id = +card.dataset.id;
    card.querySelector('.btn-card-detail').addEventListener('click', e => {
      e.stopPropagation();
      openModal(id);
    });
    card.querySelector('.btn-card-interest').addEventListener('click', e => {
      e.stopPropagation();
      toggleSelection(id);
    });
    card.addEventListener('click', () => openModal(id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(id); }
    });
  });

  // Animate new cards in
  requestAnimationFrame(() => {
    DOM.productGrid.querySelectorAll('.product-card').forEach((c, i) => {
      c.style.animationDelay = `${i * 40}ms`;
      c.classList.add('card-animate-in');
    });
  });
}

function renderCard(p, isSelected) {
  const tagClass = TAG_CLASS[p.tagType] || 'tag-classic';
  const highlights = (p.highlights || []).slice(0, 3).map(h =>
    `<li class="card-highlight-item">
      <span class="card-highlight-dot" aria-hidden="true"></span>
      <span>${h}</span>
    </li>`
  ).join('');

  const btnLabel = isSelected ? '✓ Adicionado' : '♥ Tenho interesse';

  const visualContent = p.imageUrl
    ? `<img src="${p.imageUrl}" alt="${p.name}" class="card-img" loading="lazy">`
    : `<div class="card-visual-overlay"></div><div class="card-visual-icon">${p.icon}</div>`;

  return `
    <article
      class="product-card"
      data-id="${p.id}"
      tabindex="0"
      aria-label="${p.name} — clique para ver detalhes"
    >
      <div class="card-visual" style="${p.imageUrl ? '' : 'background:' + p.gradient}" aria-hidden="true">
        ${visualContent}
        <div class="card-selected-indicator ${isSelected ? 'visible' : ''}" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span class="card-category">${p.categoryLabel}</span>
          <span class="card-separator" aria-hidden="true">·</span>
          <span class="card-tag ${tagClass}">${p.tag}</span>
        </div>

        <h3 class="card-title">${p.name}</h3>
        <p class="card-desc">${p.shortDesc}</p>

        <ul class="card-highlights" aria-label="Destaques">${highlights}</ul>

        <div class="card-actions">
          <button class="btn-card-detail" aria-label="Ver detalhes de ${p.name}">Ver detalhes</button>
          <button
            class="btn-card-interest ${isSelected ? 'added' : ''}"
            aria-label="${isSelected ? 'Remover da seleção' : 'Adicionar à seleção'}: ${p.name}"
            aria-pressed="${isSelected}"
          >${btnLabel}</button>
        </div>
      </div>
    </article>
  `;
}

/* ─── Selection ──────────────────────────────────────────────────────────── */
function toggleSelection(id) {
  const idx = state.selected.indexOf(id);
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  if (idx === -1) {
    state.selected.push(id);
    showToast(`✓ "${product.name.split(' ').slice(0,3).join(' ')}..." adicionado à seleção`);
  } else {
    state.selected.splice(idx, 1);
    showToast(`Removido da seleção`);
  }

  updateSelectionUI();
  refreshCardButtons(id);
  if (state.currentModalId === id) syncModalButton(id);
}

function updateSelectionUI() {
  const count = state.selected.length;

  // Header badge
  DOM.headerCount.textContent = count;
  DOM.headerCount.classList.remove('pop');
  void DOM.headerCount.offsetWidth;
  DOM.headerCount.classList.add('pop');

  // FAB
  DOM.fabCount.textContent = count;
  DOM.fab.classList.toggle('visible', count > 0);

  // Drawer items
  renderDrawerItems();
}

function refreshCardButtons(id) {
  const isSelected = state.selected.includes(id);
  const card = DOM.productGrid.querySelector(`[data-id="${id}"]`);
  if (!card) return;

  const indicator = card.querySelector('.card-selected-indicator');
  const btn       = card.querySelector('.btn-card-interest');
  if (indicator) indicator.classList.toggle('visible', isSelected);
  if (btn) {
    btn.textContent = isSelected ? '✓ Adicionado' : '♥ Tenho interesse';
    btn.classList.toggle('added', isSelected);
    btn.setAttribute('aria-pressed', String(isSelected));
    btn.setAttribute('aria-label', `${isSelected ? 'Remover da seleção' : 'Adicionar à seleção'}: ${PRODUCTS.find(p=>p.id===id)?.name}`);
  }
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function openModal(id) {
  const p = PRODUCTS.find(prod => prod.id === id);
  if (!p) return;

  state.currentModalId = id;
  const tagClass = TAG_CLASS[p.tagType] || 'tag-classic';

  // Populate
  if (p.imageUrl) {
    DOM.modalVisual.style.background = '';
    DOM.modalVisual.innerHTML = `<img src="${p.imageUrl}" alt="${p.name}" class="modal-img">`;
  } else {
    DOM.modalVisual.style.background = p.gradient;
    DOM.modalVisual.innerHTML = `<div style="font-size:4.5rem;filter:drop-shadow(0 8px 24px rgba(0,0,0,.2))">${p.icon}</div>`;
  }
  DOM.modalCategory.textContent = p.categoryLabel;
  DOM.modalTag.className   = `card-tag ${tagClass}`;
  DOM.modalTag.textContent = p.tag;
  DOM.modalTitle.textContent = p.name;
  DOM.modalDesc.textContent  = p.fullDesc;
  DOM.modalUsage.textContent = p.usage;

  DOM.modalHighlights.innerHTML = (p.highlights || []).map(h =>
    `<div class="modal-highlight-item">
      <span class="modal-highlight-dot" aria-hidden="true"></span>
      <span>${h}</span>
    </div>`
  ).join('');

  DOM.modalWhatsapp.href = singleProductUrl(p);
  syncModalButton(id);

  // Open
  DOM.modalOverlay.classList.add('open');
  DOM.modalOverlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';

  // Focus trap seed
  setTimeout(() => DOM.modalClose.focus(), 50);
}

function syncModalButton(id) {
  const isSelected = state.selected.includes(id);
  DOM.modalAddBtn.innerHTML = isSelected
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg> Na seleção`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Adicionar à seleção`;
}

function closeModal() {
  DOM.modalOverlay.classList.remove('open');
  DOM.modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  state.currentModalId = null;
}

/* ─── Drawer ─────────────────────────────────────────────────────────────── */
function openDrawer() {
  state.drawerOpen = true;
  DOM.drawer.classList.add('open');
  DOM.drawer.removeAttribute('aria-hidden');
  DOM.drawerOverlay.classList.add('open');
  DOM.drawerOverlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => DOM.drawerClose.focus(), 50);
}

function closeDrawer() {
  state.drawerOpen = false;
  DOM.drawer.classList.remove('open');
  DOM.drawer.setAttribute('aria-hidden', 'true');
  DOM.drawerOverlay.classList.remove('open');
  DOM.drawerOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderDrawerItems() {
  const items = state.selected.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const hasItems = items.length > 0;

  DOM.drawerEmpty.hidden = hasItems;
  DOM.drawerForm.hidden  = !hasItems;

  if (!hasItems) {
    DOM.drawerItems.innerHTML = '';
    return;
  }

  DOM.drawerItems.innerHTML = items.map(p => `
    <div class="drawer-item" data-id="${p.id}">
      <div class="drawer-item-visual" ${p.imageUrl ? '' : `style="background:${p.gradient}"`} aria-hidden="true">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">` : p.icon}
      </div>
      <div class="drawer-item-info">
        <p class="drawer-item-name">${p.name}</p>
        <p class="drawer-item-cat">${p.categoryLabel}</p>
      </div>
      <button class="drawer-item-remove" data-id="${p.id}" aria-label="Remover ${p.name} da seleção">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
  `).join('');

  DOM.drawerItems.querySelectorAll('.drawer-item-remove').forEach(btn => {
    btn.addEventListener('click', () => toggleSelection(+btn.dataset.id));
  });
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  DOM.toast.textContent = msg;
  DOM.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.toast.classList.remove('show'), 2800);
}

/* ─── Menu ───────────────────────────────────────────────────────────────── */
function openMenu() {
  state.menuOpen = true;
  DOM.mobileNav.classList.add('open');
  DOM.menuToggle.classList.add('open');
  DOM.menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  state.menuOpen = false;
  DOM.mobileNav.classList.remove('open');
  DOM.menuToggle.classList.remove('open');
  DOM.menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ─── WhatsApp link setup ─────────────────────────────────────────────────── */
function setupWhatsappLinks() {
  const genericUrl = genericWhatsappUrl();
  const ids = ['btn-whatsapp-header', 'mobile-nav-whatsapp', 'cta-whatsapp-btn', 'footer-whatsapp'];
  ids.forEach(id => {
    const el = $(id);
    if (el) el.href = genericUrl;
  });
}

/* ─── Scroll Reveal ──────────────────────────────────────────────────────── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ─── Header Scroll ──────────────────────────────────────────────────────── */
function initHeaderScroll() {
  const onScroll = () => {
    DOM.header.classList.toggle('scrolled', window.scrollY > 48);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── FAQ ────────────────────────────────────────────────────────────────── */
function initFAQ() {
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      // close all
      $$('.faq-question').forEach(b => {
        b.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
      });
      $$('.faq-answer').forEach(a => a.classList.remove('open'));
      // toggle clicked
      if (!isOpen) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        const answerId = btn.getAttribute('aria-controls');
        if (answerId) $(answerId)?.classList.add('open');
      }
    });
  });
}

/* ─── Filter & Search events ─────────────────────────────────────────────── */
function initFilters() {
  // Category chips
  $$('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.dataset.category;
      $$('[data-category]').forEach(b => {
        b.classList.toggle('active', b.dataset.category === state.activeCategory);
        b.setAttribute('aria-pressed', String(b.dataset.category === state.activeCategory));
      });
      applyFilters();
    });
  });

  // Profile chips
  $$('[data-profile]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pr = btn.dataset.profile;
      const idx = state.activeProfiles.indexOf(pr);
      if (idx === -1) {
        state.activeProfiles.push(pr);
        btn.classList.add('profile-active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        state.activeProfiles.splice(idx, 1);
        btn.classList.remove('profile-active');
        btn.setAttribute('aria-pressed', 'false');
      }
      applyFilters();
    });
  });

  // Search
  DOM.searchInput.addEventListener('input', () => {
    state.searchQuery = DOM.searchInput.value;
    DOM.searchClear.hidden = !state.searchQuery;
    applyFilters();
  });

  DOM.searchClear.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.searchQuery = '';
    DOM.searchClear.hidden = true;
    DOM.searchInput.focus();
    applyFilters();
  });

  // Clear filters
  [DOM.clearFilters, DOM.emptyClearBtn].forEach(btn => {
    btn?.addEventListener('click', clearFilters);
  });
}

function clearFilters() {
  state.activeCategory = 'all';
  state.activeProfiles = [];
  state.searchQuery    = '';
  DOM.searchInput.value = '';
  DOM.searchClear.hidden = true;
  $$('[data-category]').forEach(b => {
    b.classList.toggle('active', b.dataset.category === 'all');
    b.setAttribute('aria-pressed', String(b.dataset.category === 'all'));
  });
  $$('[data-profile]').forEach(b => {
    b.classList.remove('profile-active');
    b.setAttribute('aria-pressed', 'false');
  });
  applyFilters();
}

/* ─── Keyboard / Escape handling ─────────────────────────────────────────── */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.menuOpen)  closeMenu();
      if (state.drawerOpen) closeDrawer();
      if (state.currentModalId !== null) closeModal();
    }
  });
}

/* ─── Smooth anchor scroll (offset for fixed header) ─────────────────────── */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Card animation style injection ─────────────────────────────────────── */
function injectCardAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    .card-animate-in {
      animation: cardReveal .4s var(--ease, cubic-bezier(.25,.46,.45,.94)) both;
    }
    @keyframes cardReveal {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

/* ─── Public API (exposed on window for inline onclick attrs) ────────────── */
window.App = {
  openDrawer,
  closeDrawer,
  closeMenu,
  openMenu,
  clearFilters,
};

/* ─── Init ───────────────────────────────────────────────────────────────── */
function init() {
  injectCardAnimation();
  setupWhatsappLinks();
  applyFilters();           // initial render
  updateSelectionUI();      // sync badge
  initScrollReveal();
  initHeaderScroll();
  initFAQ();
  initFilters();
  initKeyboard();
  initAnchors();

  // Modal close
  DOM.modalClose.addEventListener('click', closeModal);
  DOM.modalOverlay.addEventListener('click', e => { if (e.target === DOM.modalOverlay) closeModal(); });
  DOM.modalAddBtn.addEventListener('click', () => {
    if (state.currentModalId !== null) toggleSelection(state.currentModalId);
  });

  // Drawer
  DOM.drawerClose.addEventListener('click', closeDrawer);
  DOM.drawerOverlay.addEventListener('click', closeDrawer);
  DOM.fab.addEventListener('click', openDrawer);

  DOM.sendWhatsapp.addEventListener('click', () => {
    window.open(buildSelectionMessage(), '_blank', 'noopener,noreferrer');
  });

  DOM.clearSelection.addEventListener('click', () => {
    if (!state.selected.length) return;
    state.selected = [];
    updateSelectionUI();
    // refresh all visible cards
    state.filtered.forEach(p => refreshCardButtons(p.id));
    showToast('Seleção limpa');
  });

  // Menu toggle
  DOM.menuToggle.addEventListener('click', () => {
    state.menuOpen ? closeMenu() : openMenu();
  });
  DOM.mobileNav.addEventListener('click', e => {
    if (e.target === DOM.mobileNav) closeMenu();
  });

  // Focus trap for modal
  DOM.modalOverlay.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(DOM.modalOverlay.querySelectorAll(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function applyHeroImages(images) {
  document.querySelectorAll('.hero-card').forEach((card, i) => {
    const key = `hero-${i + 1}`;
    if (!images[key]) return;
    const inner   = card.querySelector('.hero-card-inner');
    const labelEl = inner ? inner.querySelector('.hero-card-label') : null;
    const labelTxt = labelEl ? labelEl.textContent : '';
    if (!inner) return;
    inner.style.background = 'none';
    inner.innerHTML = `
      <img src="${images[key]}" alt="${labelTxt}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;">
      <div class="hero-card-label">${labelTxt}</div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('js/images.json')
    .then(r => r.ok ? r.json() : {})
    .catch(() => ({}))
    .then(images => {
      PRODUCTS.forEach(p => { if (images[p.id]) p.imageUrl = images[p.id]; });
      applyHeroImages(images);
      init();
    });
});
