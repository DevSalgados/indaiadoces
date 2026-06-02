module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Método não permitido' });

  const { password, action, id, image, images } = req.body || {};

  const adminPw = process.env.ADMIN_PASSWORD;
  const token   = process.env.GITHUB_TOKEN;

  if (!adminPw || !token) {
    return res.status(500).json({
      error: 'Servidor não configurado. Defina ADMIN_PASSWORD e GITHUB_TOKEN nas variáveis de ambiente do Vercel.',
    });
  }

  if (!password || password !== adminPw) {
    return res.status(401).json({ error: 'Senha incorreta.' });
  }

  const REPO   = 'DevSalgados/indaiadoces';
  const BRANCH = 'main';
  const API    = `https://api.github.com/repos/${REPO}/contents`;
  const GH     = { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };

  async function ghGet(path) {
    const r = await fetch(`${API}/${path}?ref=${BRANCH}`, { headers: GH });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`GitHub erro ${r.status}`);
    return r.json();
  }

  async function ghPut(path, content, sha, message) {
    const body = { message, content, branch: BRANCH };
    if (sha) body.sha = sha;
    const r = await fetch(`${API}/${path}`, { method: 'PUT', headers: GH, body: JSON.stringify(body) });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.message || `GitHub erro ${r.status}`);
    }
    return r.json();
  }

  try {
    if (action === 'load') {
      const file = await ghGet('js/images.json');
      if (!file) return res.json({ images: {}, sha: null });
      let imgs = {};
      try { imgs = JSON.parse(Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8')); } catch {}
      return res.json({ images: imgs, sha: file.sha });
    }

    if (action === 'upload') {
      if (!id || !image) return res.status(400).json({ error: 'id e image são obrigatórios.' });
      const existing = await ghGet(`images/produto-${id}.jpg`);
      await ghPut(`images/produto-${id}.jpg`, image, existing?.sha, `Admin: foto produto ${id}`);
      return res.json({ ok: true });
    }

    if (action === 'update-json') {
      if (!images) return res.status(400).json({ error: 'images é obrigatório.' });
      const existing = await ghGet('js/images.json');
      const b64      = Buffer.from(JSON.stringify(images, null, 2)).toString('base64');
      const result   = await ghPut('js/images.json', b64, existing?.sha, 'Admin: atualiza catálogo de fotos');
      return res.json({ ok: true, sha: result.content.sha });
    }

    return res.status(400).json({ error: 'Ação inválida.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno.' });
  }
};
