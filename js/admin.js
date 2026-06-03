const RAW = 'https://raw.githubusercontent.com/DevSalgados/indaiadoces/main';

let imagesSHA     = null;
let currentImages = {};
const pending     = {};

const HERO_SLOTS = [
  { id: 'hero-1', label: 'Brigadeiro Belga',    sub: 'Card 1 — Vitrine', gradient: 'linear-gradient(145deg, #F0E0D0 0%, #C4906A 50%, #7A4020 100%)', icon: '🍫' },
  { id: 'hero-2', label: 'Pistache',             sub: 'Card 2 — Vitrine', gradient: 'linear-gradient(145deg, #EBF0E0 0%, #B8C89A 50%, #6A8040 100%)', icon: '🌿' },
  { id: 'hero-3', label: 'Tartelette Bosque',    sub: 'Card 3 — Vitrine', gradient: 'linear-gradient(145deg, #EED8EC 0%, #A060B8 50%, #683090 100%)', icon: '🫐' },
];

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
}

/* ── Render hero slots ────────────────────────────────────────── */
function renderHeroSection() {
  const container = document.getElementById('hero-section');
  if (!container) return;

  container.innerHTML = HERO_SLOTS.map(slot => {
    const hasPending = pending[slot.id] !== undefined;
    const hasImage   = !!currentImages[slot.id];
    const previewSrc = hasPending
      ? pending[slot.id + '_preview']
      : (currentImages[slot.id] || '');

    let badge = '';
    if (hasPending)    badge = '<span class="badge badge-pending">● Pendente</span>';
    else if (hasImage) badge = '<span class="badge badge-saved">✓ Com foto</span>';
    else               badge = '<span class="badge badge-none">Sem foto</span>';

    return `
      <div class="admin-card" data-id="${slot.id}">
        <div class="admin-card-visual" role="button" tabindex="0"
             title="${previewSrc ? 'Trocar foto' : 'Adicionar foto'}">
          ${previewSrc
            ? `<img src="${previewSrc}" alt="${slot.label}" class="admin-card-img">`
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
          <p class="admin-card-name">${slot.label}</p>
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
}

/* ── Render grid ──────────────────────────────────────────────── */
function renderGrid() {
  const grid = document.getElementById('product-grid');

  grid.innerHTML = PRODUCTS.map(p => {
    const hasPending = pending[p.id] !== undefined;
    const hasImage   = !!currentImages[p.id];
    const previewSrc = hasPending ? pending[p.id + '_preview'] : (currentImages[p.id] || '');

    let badge = '';
    if (hasPending)    badge = '<span class="badge badge-pending">● Pendente</span>';
    else if (hasImage) badge = '<span class="badge badge-saved">✓ Com foto</span>';
    else               badge = '<span class="badge badge-none">Sem foto</span>';

    return `
      <div class="admin-card" data-id="${p.id}">
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
}

function updateSaveBtn() {
  const n   = Object.keys(pending).filter(k => !k.includes('_preview')).length;
  const btn = document.getElementById('save-btn');
  btn.textContent = n > 0 ? `Publicar ${n} alteração${n > 1 ? 'ões' : ''}` : 'Publicar alterações';
  btn.classList.toggle('has-changes', n > 0);
}

/* ── Save ─────────────────────────────────────────────────────── */
async function save() {
  const ids = Object.keys(pending).filter(k => !k.includes('_preview')).map(Number);
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
    const countLabel = document.getElementById('products-count-label');
    if (countLabel) countLabel.textContent = `— ${PRODUCTS.length} produtos`;
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

  if (getPassword()) {
    document.getElementById('token-input').value = getPassword();
    login();
  }
});
