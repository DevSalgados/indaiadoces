const RAW = 'https://raw.githubusercontent.com/DevSalgados/indaiadoces/main';

let imagesSHA     = null;
let currentImages = {};
let currentPatch  = { deleted: [], added: [], heroLabels: {} };
const pending     = {};

const HERO_SLOTS = [
  { id: 'hero-1', label: 'Brigadeiro Belga',    sub: 'Card 1 — Vitrine', gradient: 'linear-gradient(145deg, #F0E0D0 0%, #C4906A 50%, #7A4020 100%)', icon: '🍫' },
  { id: 'hero-2', label: 'Pistache',             sub: 'Card 2 — Vitrine', gradient: 'linear-gradient(145deg, #EBF0E0 0%, #B8C89A 50%, #6A8040 100%)', icon: '🌿' },
  { id: 'hero-3', label: 'Tartelette Bosque',    sub: 'Card 3 — Vitrine', gradient: 'linear-gradient(145deg, #EED8EC 0%, #A060B8 50%, #683090 100%)', icon: '🫐' },
];

const CATEGORY_GRADIENTS = {
  bombons:              'linear-gradient(145deg, #F9EBEA 0%, #E8B4B8 60%, #C17B85 100%)',
  brigadeiros:          'linear-gradient(145deg, #F0E0D0 0%, #C4906A 60%, #7A4020 100%)',
  classicos:            'linear-gradient(145deg, #FBF0D8 0%, #DCAA60 60%, #A07020 100%)',
  copinhos:             'linear-gradient(145deg, #F8EDDC 0%, #C08030 60%, #784010 100%)',
  'mini-sobremesas':    'linear-gradient(145deg, #F0D4D8 0%, #C04860 60%, #802040 100%)',
  'palhas-italianas':   'linear-gradient(145deg, #F4ECDC 0%, #C09848 60%, #887020 100%)',
  tartelettes:          'linear-gradient(145deg, #EED8F0 0%, #A060B8 60%, #703090 100%)',
};

function getPassword() { return sessionStorage.getItem('admin_pw') || ''; }

/* ── API ──────────────────────────────────────────────────────── */
async function apiCall(action, extra = {}) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: getPassword(), action, ...extra }),
      signal: ctrl.signal,
    });
    clearTimeout(tid);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
    return data;
  } catch (e) {
    clearTimeout(tid);
    throw e.name === 'AbortError'
      ? new Error('Tempo limite esgotado — verifique sua conexão.')
      : e;
  }
}

/* ── Image compression ────────────────────────────────────────── */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1200;
        let { width: w, height: h } = img;
        if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
        else        { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.88).split(',')[1]);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ── Load state ───────────────────────────────────────────────── */
async function loadImages() {
  const data    = await apiCall('load');
  imagesSHA     = data.sha;
  currentImages = data.images || {};
  currentPatch  = data.patch  || { deleted: [], added: [], heroLabels: {} };
  if (!currentPatch.heroLabels) currentPatch.heroLabels = {};
}

/* ── Render hero slots ────────────────────────────────────────── */
function renderHeroSection() {
  const container = document.getElementById('hero-section');
  if (!container) return;

  container.innerHTML = HERO_SLOTS.map(slot => {
    const hasPending   = pending[slot.id] !== undefined;
    const hasImage     = !!currentImages[slot.id];
    const previewSrc   = hasPending ? pending[slot.id + '_preview'] : (currentImages[slot.id] || '');
    const currentLabel = (currentPatch.heroLabels || {})[slot.id] || slot.label;

    let badge = '';
    if (hasPending)    badge = '<span class="badge badge-pending">● Pendente</span>';
    else if (hasImage) badge = '<span class="badge badge-saved">✓ Com foto</span>';
    else               badge = '<span class="badge badge-none">Sem foto</span>';

    return `
      <div class="admin-card" data-id="${slot.id}">
        <div class="admin-card-visual" role="button" tabindex="0"
             title="${previewSrc ? 'Trocar foto' : 'Adicionar foto'}">
          ${previewSrc
            ? `<img src="${previewSrc}" alt="${currentLabel}" class="admin-card-img">`
            : `<div class="admin-card-placeholder" style="background:${slot.gradient}">${slot.icon}</div>`
          }
          <div class="admin-card-overlay">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>${previewSrc ? 'Trocar foto' : 'Adicionar foto'}</span>
          </div>
          <input type="file" accept="image/*" class="file-input" data-id="${slot.id}" style="display:none">
        </div>
        <div class="admin-card-info">
          ${badge}
          <div class="hero-label-row">
            <p class="admin-card-name">${currentLabel}</p>
            <button class="hero-edit-name-btn" data-slotid="${slot.id}" title="Editar nome do card">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          <p class="admin-card-cat">${slot.sub}</p>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.admin-card-visual').forEach(visual => {
    visual.addEventListener('click', () => visual.querySelector('.file-input').click());
    visual.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); visual.querySelector('.file-input').click(); }
    });
  });

  container.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      const id   = input.dataset.id;
      const card = container.querySelector(`.admin-card[data-id="${id}"]`);
      if (card) card.classList.add('loading');
      try {
        const b64 = await compressImage(file);
        if (pending[id + '_preview']) URL.revokeObjectURL(pending[id + '_preview']);
        pending[id]              = b64;
        pending[id + '_preview'] = URL.createObjectURL(file);
        renderHeroSection();
        updateSaveBtn();
      } catch (err) {
        showStatus(`Erro ao processar imagem: ${err.message}`, 'error');
      }
    });
  });

  container.querySelectorAll('.hero-edit-name-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      startHeroLabelEdit(btn);
    });
  });
}

/* ── Render grid ──────────────────────────────────────────────── */
function renderGrid() {
  const grid = document.getElementById('product-grid');

  const baseProducts  = PRODUCTS.filter(p => !currentPatch.deleted.includes(p.id));
  const addedProducts = currentPatch.added || [];
  const allProducts   = [...baseProducts, ...addedProducts];

  const countLabel = document.getElementById('products-count-label');
  if (countLabel) countLabel.textContent = `— ${allProducts.length} produto${allProducts.length !== 1 ? 's' : ''}`;

  if (!allProducts.length) {
    grid.innerHTML = '<p style="color:var(--muted);padding:1rem 0;font-size:.9rem;">Nenhum produto cadastrado.</p>';
    return;
  }

  grid.innerHTML = allProducts.map(p => {
    const isAdded    = addedProducts.some(a => a.id === p.id);
    const hasPending = pending[p.id] !== undefined;
    const hasImage   = !!currentImages[p.id];
    const previewSrc = hasPending ? pending[p.id + '_preview'] : (currentImages[p.id] || '');

    let badge = '';
    if (hasPending)    badge = '<span class="badge badge-pending">● Pendente</span>';
    else if (hasImage) badge = '<span class="badge badge-saved">✓ Com foto</span>';
    else               badge = '<span class="badge badge-none">Sem foto</span>';

    return `
      <div class="admin-card" data-id="${p.id}" data-source="${isAdded ? 'added' : 'base'}">
        <div class="admin-card-visual" role="button" tabindex="0"
             title="${previewSrc ? 'Trocar foto' : 'Adicionar foto'}">
          ${previewSrc
            ? `<img src="${previewSrc}" alt="${p.name}" class="admin-card-img">`
            : `<div class="admin-card-placeholder" style="background:${p.gradient}">${p.icon}</div>`
          }
          <div class="admin-card-overlay">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>${previewSrc ? 'Trocar foto' : 'Adicionar foto'}</span>
          </div>
          <input type="file" accept="image/*" class="file-input" data-id="${p.id}" style="display:none">
        </div>
        <div class="admin-card-info">
          ${badge}
          <p class="admin-card-name">${p.name}</p>
          <p class="admin-card-cat">${p.categoryLabel}</p>
          <div class="product-card-actions">
            <button class="edit-product-btn" data-id="${p.id}" data-source="${isAdded ? 'added' : 'base'}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
            <button class="delete-product-btn" data-id="${p.id}" data-source="${isAdded ? 'added' : 'base'}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              Excluir
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.admin-card-visual').forEach(visual => {
    visual.addEventListener('click', () => visual.querySelector('.file-input').click());
    visual.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); visual.querySelector('.file-input').click(); }
    });
  });

  grid.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      const id   = +input.dataset.id;
      const card = grid.querySelector(`.admin-card[data-id="${id}"]`);
      if (card) card.classList.add('loading');
      try {
        const b64 = await compressImage(file);
        if (pending[id + '_preview']) URL.revokeObjectURL(pending[id + '_preview']);
        pending[id]              = b64;
        pending[id + '_preview'] = URL.createObjectURL(file);
        renderGrid();
        updateSaveBtn();
      } catch (err) {
        showStatus(`Erro ao processar imagem: ${err.message}`, 'error');
      }
    });
  });

  grid.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openEditModal(+btn.dataset.id, btn.dataset.source);
    });
  });

  grid.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteProduct(+btn.dataset.id, btn.dataset.source);
    });
  });
}

/* ── Hero label edit ─────────────────────────────────────────── */
function startHeroLabelEdit(btn) {
  const slotId       = btn.dataset.slotid;
  const currentLabel = (currentPatch.heroLabels || {})[slotId] || HERO_SLOTS.find(s => s.id === slotId)?.label || '';
  const row          = btn.closest('.hero-label-row');

  row.innerHTML = `
    <input class="hero-label-input" type="text" value="${currentLabel.replace(/"/g, '&quot;')}" maxlength="40">
    <button class="hero-label-save" title="Salvar">✓</button>
    <button class="hero-label-cancel" title="Cancelar">✗</button>
  `;

  const input     = row.querySelector('.hero-label-input');
  const saveBtn   = row.querySelector('.hero-label-save');
  const cancelBtn = row.querySelector('.hero-label-cancel');

  input.focus();
  input.select();

  const doSave = async () => {
    const newLabel = input.value.trim();
    if (!newLabel) { input.focus(); return; }
    await saveHeroLabel(slotId, newLabel);
  };

  saveBtn.addEventListener('click', doSave);
  cancelBtn.addEventListener('click', () => renderHeroSection());
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); doSave(); }
    if (e.key === 'Escape') { e.preventDefault(); renderHeroSection(); }
  });
}

async function saveHeroLabel(slotId, label) {
  const newPatch = {
    ...currentPatch,
    heroLabels: { ...(currentPatch.heroLabels || {}), [slotId]: label },
  };
  setSaving(true);
  showStatus('Salvando nome do card…', 'info');
  try {
    await apiCall('save-patch', { patch: newPatch });
    currentPatch = newPatch;
    showStatus('✓ Nome do card atualizado.', 'success');
  } catch (err) {
    showStatus(`Erro: ${err.message}`, 'error');
  } finally {
    setSaving(false);
    renderHeroSection();
  }
}

/* ── Delete product ───────────────────────────────────────────── */
async function deleteProduct(id, source) {
  const list    = source === 'added' ? currentPatch.added : PRODUCTS;
  const product = list.find(p => p.id === id);
  const name    = product?.name || 'este produto';

  if (!confirm(`Excluir "${name}"?\n\nEsta ação é irreversível.`)) return;

  const newPatch = { deleted: [...currentPatch.deleted], added: [...currentPatch.added] };
  if (source === 'added') {
    newPatch.added = newPatch.added.filter(p => p.id !== id);
  } else {
    if (!newPatch.deleted.includes(id)) newPatch.deleted.push(id);
  }

  setSaving(true);
  showStatus('Excluindo produto…', 'info');
  try {
    await apiCall('save-patch', { patch: newPatch });
    currentPatch = newPatch;
    if (pending[id]) { URL.revokeObjectURL(pending[id + '_preview']); delete pending[id]; delete pending[id + '_preview']; }
    showStatus(`✓ "${name}" excluído.`, 'success');
    renderGrid();
    updateSaveBtn();
  } catch (err) {
    showStatus(`Erro: ${err.message}`, 'error');
  } finally {
    setSaving(false);
  }
}

/* ── Add product ──────────────────────────────────────────────── */
function nextProductId() {
  const ids = [...PRODUCTS.map(p => p.id), ...currentPatch.added.map(p => p.id)].filter(Number.isFinite);
  return ids.length ? Math.max(...ids) + 1 : 26;
}

function openAddModal() {
  const overlay = document.getElementById('add-modal-overlay');
  document.getElementById('add-product-form').reset();
  document.getElementById('add-form-error').hidden   = true;
  document.getElementById('add-modal-edit-id').value = '';
  document.getElementById('add-modal-edit-source').value = '';
  document.getElementById('add-modal-title').textContent = 'Novo Produto';
  document.getElementById('add-save-btn').textContent    = 'Adicionar produto';
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.querySelector('#add-product-form [name="name"]').focus(), 50);
}

function closeAddModal() {
  document.getElementById('add-modal-overlay').hidden = true;
  document.body.style.overflow = '';
}

function openEditModal(id, source) {
  const list    = source === 'added' ? currentPatch.added : PRODUCTS;
  const product = list.find(p => p.id === id);
  if (!product) return;

  const form = document.getElementById('add-product-form');
  form.reset();

  document.getElementById('add-modal-edit-id').value     = id;
  document.getElementById('add-modal-edit-source').value = source;
  document.getElementById('add-modal-title').textContent  = 'Editar Produto';
  document.getElementById('add-save-btn').textContent     = 'Salvar alterações';
  document.getElementById('add-form-error').hidden        = true;

  form.querySelector('[name="name"]').value     = product.name      || '';
  form.querySelector('[name="category"]').value = product.category  || '';
  form.querySelector('[name="icon"]').value     = product.icon      || '';
  form.querySelector('[name="tag"]').value      = product.tag       || '';
  form.querySelector('[name="tagType"]').value  = product.tagType   || '';
  form.querySelector('[name="shortDesc"]').value = product.shortDesc || '';
  form.querySelector('[name="fullDesc"]').value  = product.fullDesc  || '';
  form.querySelector('[name="h1"]').value = (product.highlights || [])[0] || '';
  form.querySelector('[name="h2"]').value = (product.highlights || [])[1] || '';
  form.querySelector('[name="h3"]').value = (product.highlights || [])[2] || '';
  form.querySelector('[name="h4"]').value = (product.highlights || [])[3] || '';
  form.querySelector('[name="usage"]').value = product.usage || '';

  form.querySelectorAll('[name="profiles"]').forEach(cb => {
    cb.checked = (product.profiles || []).includes(cb.value);
  });

  document.getElementById('add-modal-overlay').hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => form.querySelector('[name="name"]').focus(), 50);
}

async function saveNewProduct(e) {
  e.preventDefault();
  const form    = document.getElementById('add-product-form');
  const get     = n => form.querySelector(`[name="${n}"]`).value.trim();
  const checked = n => [...form.querySelectorAll(`[name="${n}"]:checked`)].map(el => el.value);
  const errEl   = document.getElementById('add-form-error');

  const name      = get('name');
  const category  = get('category');
  const tag       = get('tag');
  const tagType   = get('tagType');
  const shortDesc = get('shortDesc');
  const fullDesc  = get('fullDesc') || shortDesc;
  const usage     = get('usage');
  const icon      = get('icon') || '◈';
  const profiles  = checked('profiles');
  const highlights = [get('h1'), get('h2'), get('h3'), get('h4')].filter(Boolean);

  if (!name || !category || !tag || !tagType || !shortDesc || !highlights.length) {
    errEl.textContent = 'Preencha todos os campos obrigatórios (*).';
    errEl.hidden = false;
    return;
  }
  errEl.hidden = true;

  const rawEditId  = document.getElementById('add-modal-edit-id').value;
  const editId     = rawEditId ? +rawEditId : null;
  const editSource = document.getElementById('add-modal-edit-source').value;
  const isEdit     = editId !== null && !isNaN(editId);

  const product = {
    id:            isEdit ? editId : nextProductId(),
    name,
    category,
    categoryLabel: (CATEGORIES.find(c => c.id === category) || {}).label || category,
    tag,
    tagType,
    shortDesc,
    fullDesc,
    highlights,
    usage,
    profiles,
    gradient:    CATEGORY_GRADIENTS[category] || 'linear-gradient(145deg, #F0E0D0 0%, #C4906A 60%, #7A4020 100%)',
    icon,
    searchTerms: name.toLowerCase(),
  };

  let newPatch;
  if (isEdit && editSource === 'added') {
    newPatch = {
      deleted: [...currentPatch.deleted],
      added:   currentPatch.added.map(p => p.id === editId ? product : p),
    };
  } else if (isEdit) {
    const deletedIds = currentPatch.deleted.includes(editId)
      ? [...currentPatch.deleted]
      : [...currentPatch.deleted, editId];
    newPatch = { deleted: deletedIds, added: [...currentPatch.added, product] };
  } else {
    newPatch = { deleted: [...currentPatch.deleted], added: [...currentPatch.added, product] };
  }

  const btn = document.getElementById('add-save-btn');
  btn.disabled    = true;
  btn.textContent = 'Salvando…';

  try {
    await apiCall('save-patch', { patch: newPatch });
    currentPatch = newPatch;
    closeAddModal();
    showStatus(`✓ "${name}" ${isEdit ? 'atualizado' : 'adicionado ao catálogo'}.`, 'success');
    renderGrid();
    updateSaveBtn();
  } catch (err) {
    errEl.textContent = `Erro ao salvar: ${err.message}`;
    errEl.hidden = false;
  } finally {
    btn.disabled    = false;
    btn.textContent = isEdit ? 'Salvar alterações' : 'Adicionar produto';
  }
}

function updateSaveBtn() {
  const n   = Object.keys(pending).filter(k => !k.includes('_preview')).length;
  const btn = document.getElementById('save-btn');
  btn.textContent = n > 0 ? `Publicar ${n} alteração${n > 1 ? 'ões' : ''}` : 'Publicar alterações';
  btn.classList.toggle('has-changes', n > 0);
}

/* ── Save ─────────────────────────────────────────────────────── */
async function save() {
  const ids = Object.keys(pending).filter(k => !k.includes('_preview'));
  if (!ids.length) { showStatus('Nenhuma alteração pendente.', 'info'); return; }

  setSaving(true);
  const newImages = { ...currentImages };

  try {
    for (let i = 0; i < ids.length; i++) {
      const id     = ids[i];
      const isHero = String(id).startsWith('hero-');
      showStatus(`Enviando foto ${i + 1} de ${ids.length}…`, 'info');
      await apiCall('upload', { id, image: pending[id] });
      newImages[id] = isHero
        ? `${RAW}/images/${id}.jpg`
        : `${RAW}/images/produto-${id}.jpg`;
    }

    showStatus('Atualizando catálogo…', 'info');
    const result  = await apiCall('update-json', { images: newImages });
    imagesSHA     = result.sha;
    currentImages = { ...newImages };

    ids.forEach(id => {
      URL.revokeObjectURL(pending[id + '_preview']);
      delete pending[id];
      delete pending[id + '_preview'];
    });

    showStatus('✓ Publicado! As fotos aparecem no site em alguns segundos.', 'success');
    renderHeroSection();
    renderGrid();
    updateSaveBtn();
  } catch (err) {
    showStatus(`Erro: ${err.message}`, 'error');
  } finally {
    setSaving(false);
  }
}

/* ── UI helpers ───────────────────────────────────────────────── */
function showStatus(msg, type) {
  const bar = document.getElementById('status-bar');
  bar.textContent = msg;
  bar.className   = `status-bar status-${type}`;
  bar.hidden      = false;
}

function setSaving(on) {
  document.getElementById('save-btn').disabled = on;
  ['product-grid', 'hero-section'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.opacity       = on ? '0.6' : '';
    el.style.pointerEvents = on ? 'none' : '';
  });
}

/* ── Auth ─────────────────────────────────────────────────────── */
async function login() {
  const pw = document.getElementById('token-input').value.trim();
  if (!pw) { showAuthError('Digite a senha antes de continuar.'); return; }

  sessionStorage.setItem('admin_pw', pw);
  const btn = document.getElementById('login-btn');
  btn.disabled    = true;
  btn.textContent = 'Verificando…';

  try {
    await loadImages();
    document.getElementById('auth-screen').hidden  = true;
    document.getElementById('main-content').hidden = false;
    document.getElementById('logout-btn').hidden   = false;
    renderHeroSection();
    renderGrid();
    updateSaveBtn();
  } catch (err) {
    showAuthError(err.message);
    sessionStorage.removeItem('admin_pw');
    btn.disabled    = false;
    btn.textContent = 'Entrar';
  }
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.hidden      = false;
}

function logout() {
  sessionStorage.removeItem('admin_pw');
  location.reload();
}

window.addEventListener('beforeunload', e => {
  if (Object.keys(pending).some(k => !k.includes('_preview'))) {
    e.preventDefault(); e.returnValue = '';
  }
});

/* ── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-btn').addEventListener('click', login);
  document.getElementById('token-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });
  document.getElementById('save-btn').addEventListener('click', save);
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('add-product-btn').addEventListener('click', openAddModal);
  document.getElementById('add-modal-close').addEventListener('click', closeAddModal);
  document.getElementById('add-cancel-btn').addEventListener('click', closeAddModal);
  document.getElementById('add-product-form').addEventListener('submit', saveNewProduct);
  document.getElementById('add-modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAddModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('add-modal-overlay').hidden) closeAddModal();
  });

  if (getPassword()) {
    document.getElementById('token-input').value = getPassword();
    login();
  }
});
