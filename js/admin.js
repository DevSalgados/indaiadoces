const REPO   = 'DevSalgados/indaiadoces';
const BRANCH = 'main';
const RAW    = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const API    = `https://api.github.com/repos/${REPO}/contents`;

let imagesSHA    = null;
let currentImages = {};
const pending    = {}; // id -> base64  |  id+'_preview' -> objectURL

/* ── Auth ─────────────────────────────────────────────────────── */
function getToken() { return sessionStorage.getItem('gh_token') || ''; }

/* ── GitHub API ───────────────────────────────────────────────── */
function ghHeaders() {
  return {
    Authorization: `token ${getToken()}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

async function ghGet(path) {
  const res = await fetch(`${API}/${path}?ref=${BRANCH}`, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (res.status === 401) throw new Error('Token inválido ou sem permissão de acesso ao repositório.');
  if (!res.ok) throw new Error(`GitHub erro ${res.status}`);
  return res.json();
}

async function ghPut(path, b64, sha, msg) {
  const body = { message: msg, content: b64, branch: BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(`${API}/${path}`, {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || `GitHub erro ${res.status}`);
  }
  return res.json();
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
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.88).split(',')[1]);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ── Load current state from GitHub ──────────────────────────── */
async function loadImages() {
  const file = await ghGet('js/images.json');
  if (file) {
    imagesSHA = file.sha;
    try { currentImages = JSON.parse(atob(file.content.replace(/\n/g, ''))); }
    catch { currentImages = {}; }
  } else {
    imagesSHA = null;
    currentImages = {};
  }
}

/* ── Render product grid ──────────────────────────────────────── */
function renderGrid() {
  const grid = document.getElementById('product-grid');

  grid.innerHTML = PRODUCTS.map(p => {
    const hasPending = pending[p.id] !== undefined;
    const hasImage   = !!currentImages[p.id];
    const previewSrc = hasPending ? pending[p.id + '_preview'] : (currentImages[p.id] || '');

    let badge = '';
    if (hasPending)      badge = '<span class="badge badge-pending">● Pendente</span>';
    else if (hasImage)   badge = '<span class="badge badge-saved">✓ Com foto</span>';
    else                 badge = '<span class="badge badge-none">Sem foto</span>';

    return `
      <div class="admin-card" data-id="${p.id}">
        <label class="admin-card-visual" title="Clique para selecionar foto">
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
          <input type="file" accept="image/*" class="file-input" data-id="${p.id}" hidden>
        </label>
        <div class="admin-card-info">
          ${badge}
          <p class="admin-card-name">${p.name}</p>
          <p class="admin-card-cat">${p.categoryLabel}</p>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      const id   = +input.dataset.id;
      const card = grid.querySelector(`.admin-card[data-id="${id}"]`);
      card.classList.add('loading');
      try {
        const b64 = await compressImage(file);
        if (pending[id + '_preview']) URL.revokeObjectURL(pending[id + '_preview']);
        pending[id]              = b64;
        pending[id + '_preview'] = URL.createObjectURL(file);
        renderGrid();
        updateSaveBtn();
      } catch (err) {
        showStatus(`Erro ao processar imagem: ${err.message}`, 'error');
      } finally {
        card.classList.remove('loading');
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

/* ── Save / publish ───────────────────────────────────────────── */
async function save() {
  const ids = Object.keys(pending).filter(k => !k.includes('_preview')).map(Number);
  if (!ids.length) { showStatus('Nenhuma alteração pendente.', 'info'); return; }

  setSaving(true);
  const newImages = { ...currentImages };

  try {
    for (let i = 0; i < ids.length; i++) {
      const id   = ids[i];
      const path = `images/produto-${id}.jpg`;
      showStatus(`Enviando foto ${i + 1} de ${ids.length}…`, 'info');
      const existing = await ghGet(path);
      await ghPut(path, pending[id], existing?.sha, `Admin: foto produto ${id}`);
      newImages[id] = `${RAW}/images/produto-${id}.jpg`;
    }

    showStatus('Atualizando catálogo…', 'info');
    const b64json = btoa(JSON.stringify(newImages, null, 2));
    const result  = await ghPut('js/images.json', b64json, imagesSHA,
      `Admin: ${ids.length} foto${ids.length > 1 ? 's' : ''} atualizada${ids.length > 1 ? 's' : ''}`);
    imagesSHA     = result.content.sha;
    currentImages = { ...newImages };

    ids.forEach(id => {
      URL.revokeObjectURL(pending[id + '_preview']);
      delete pending[id];
      delete pending[id + '_preview'];
    });

    showStatus('✓ Publicado! As fotos aparecem no site em alguns segundos.', 'success');
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
  document.getElementById('product-grid').style.opacity = on ? '0.6' : '';
  document.getElementById('product-grid').style.pointerEvents = on ? 'none' : '';
}

/* ── Auth ─────────────────────────────────────────────────────── */
async function login() {
  const token = document.getElementById('token-input').value.trim();
  if (!token) { showAuthError('Cole o token do GitHub antes de continuar.'); return; }

  sessionStorage.setItem('gh_token', token);
  const btn = document.getElementById('login-btn');
  btn.disabled    = true;
  btn.textContent = 'Verificando…';

  try {
    await loadImages();
    document.getElementById('auth-screen').hidden  = true;
    document.getElementById('main-content').hidden = false;
    document.getElementById('logout-btn').hidden   = false;
    renderGrid();
    updateSaveBtn();
  } catch (err) {
    showAuthError(err.message);
    sessionStorage.removeItem('gh_token');
    btn.disabled    = false;
    btn.textContent = 'Entrar';
  }
}

function showAuthError(msg) {
  const el    = document.getElementById('auth-error');
  el.textContent = msg;
  el.hidden   = false;
}

function logout() {
  sessionStorage.removeItem('gh_token');
  location.reload();
}

/* ── Unsaved changes warning ──────────────────────────────────── */
window.addEventListener('beforeunload', e => {
  const hasPending = Object.keys(pending).some(k => !k.includes('_preview'));
  if (hasPending) { e.preventDefault(); e.returnValue = ''; }
});

/* ── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-btn').addEventListener('click', login);
  document.getElementById('token-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });
  document.getElementById('save-btn').addEventListener('click', save);
  document.getElementById('logout-btn').addEventListener('click', logout);

  if (getToken()) login();
});
