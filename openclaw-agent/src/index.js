/**
 * OpenClaw Gateway — isolated editorial agent control plane.
 * Workspace: SOUL.md, AGENTS.md, TOOLS.md (mounted at OPENCLAW_WORKSPACE).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.OPENCLAW_CONTROL_PORT || 18789);
const WORKSPACE =
  process.env.OPENCLAW_WORKSPACE ||
  path.join(process.env.HOME || '', '.openclaw', 'workspace');

const LLM_API_KEY = process.env.LLM_API_KEY || '';
const LLM_API_URL =
  process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function readWorkspaceFile(name) {
  const filePath = path.join(WORKSPACE, name);
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch {
    return '';
  }
}

function buildSystemContext() {
  const soul = readWorkspaceFile('SOUL.md');
  const agents = readWorkspaceFile('AGENTS.md');
  const tools = readWorkspaceFile('TOOLS.md');
  return [soul, agents, tools].filter(Boolean).join('\n\n---\n\n');
}

function stripHtml(html) {
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 2_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

async function callLlm(taskPrompt, userContent) {
  if (!LLM_API_KEY) {
    throw new Error('LLM_NOT_CONFIGURED');
  }

  const system = `${buildSystemContext()}\n\n---\n\n${taskPrompt}`;
  const response = await fetch(LLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userContent },
      ],
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`LLM error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return (
    data.choices?.[0]?.message?.content ??
    data.output ??
    data.text ??
    data.content ??
    ''
  ).trim();
}

function mockSeo(content) {
  const words = content.split(/\s+/).filter(Boolean);
  const titleBase = words.slice(0, 8).join(' ') || 'Știri Crypto — analiză';
  const descBase = words.slice(0, 24).join(' ') || 'Analiză crypto și context macro.';
  return {
    metaTitle: truncate(`${titleBase} | Știrile Crypto`, 60),
    metaDescription: truncate(`${descBase} Citește pe stirilecrypto.ro.`, 160),
    mock: true,
  };
}

function mockFormat(content) {
  const text = content.trim();
  if (!text) return { text: content, mock: true };
  return {
    text: text.charAt(0).toUpperCase() + text.slice(1),
    mock: true,
  };
}

function parseSeoResponse(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const p = JSON.parse(match[0]);
    const metaTitle = (p.metaTitle || p.meta_title || '').trim();
    const metaDescription = (p.metaDescription || p.meta_description || '').trim();
    if (!metaTitle || !metaDescription) return null;
    return {
      metaTitle: truncate(metaTitle, 60),
      metaDescription: truncate(metaDescription, 160),
    };
  } catch {
    return null;
  }
}

async function handleSeo(content) {
  const plain = stripHtml(content);
  const task = `Generează Meta Title (max 60 caractere) și Meta Description (max 160 caractere) pentru Google.
Răspunde DOAR cu JSON: {"metaTitle":"...","metaDescription":"..."}`;

  try {
    const raw = await callLlm(task, plain.slice(0, 6000));
    const parsed = parseSeoResponse(raw);
    if (parsed) return parsed;
  } catch (err) {
    if (err.message !== 'LLM_NOT_CONFIGURED') console.error('[openclaw] seo:', err.message);
  }
  return mockSeo(plain);
}

async function handleFormat(content) {
  const plain = stripHtml(content);
  const task = `Rescrie textul în ton premium de jurnalism crypto românesc. Returnează DOAR textul final, fără explicații.`;

  try {
    const text = await callLlm(task, plain.slice(0, 8000));
    if (text) return { text };
  } catch (err) {
    if (err.message !== 'LLM_NOT_CONFIGURED') console.error('[openclaw] format:', err.message);
  }
  return mockFormat(plain);
}

async function insertDraft({ title, excerpt, content, category }) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const slug = `${slugify(title)}-${Date.now()}`;
  const row = {
    title,
    slug,
    excerpt,
    content,
    category: category || 'ȘTIRI GENERALE',
    status: 'draft',
    image_url: null,
    published_at: null,
    meta_title: null,
    meta_description: null,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/stiri`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Supabase insert failed: ${res.status} ${errText}`);
  }

  const rows = await res.json();
  const article = Array.isArray(rows) ? rows[0] : rows;
  return { id: article.id, slug: article.slug, status: 'draft' };
}

async function handleDraft(content, extras = {}) {
  const plain = stripHtml(content);
  let title = extras.title?.trim();
  let excerpt = extras.excerpt?.trim();
  let body = plain;

  if (!title) {
    const firstLine = plain.split('\n')[0]?.replace(/^#+\s*/, '').trim();
    title = firstLine || `Draft OpenClaw ${new Date().toISOString().slice(0, 10)}`;
  }
  if (!excerpt) {
    excerpt = plain.slice(0, 200).trim();
  }

  const task = `Redactează un articol complet în Markdown premium (română) despre subiectul dat. Include titlu pe prima linie ca H1.`;
  try {
    const article = await callLlm(task, plain.slice(0, 12000));
    if (article) {
      body = article;
      const h1 = article.match(/^#\s+(.+)$/m);
      if (h1) title = h1[1].trim();
    }
  } catch (err) {
    if (err.message !== 'LLM_NOT_CONFIGURED') console.error('[openclaw] draft:', err.message);
  }

  return insertDraft({
    title,
    excerpt,
    content: body,
    category: extras.category,
  });
}

async function handleRun(body) {
  const { action, content, title, excerpt, category } = body;

  if (!action) {
    return { status: 400, payload: { error: 'Missing action. Use seo | format | draft.' } };
  }
  if (!content?.trim() && action !== 'health') {
    return { status: 400, payload: { error: 'Content is required.' } };
  }

  switch (action) {
    case 'seo':
      return { status: 200, payload: await handleSeo(content) };
    case 'format':
      return { status: 200, payload: await handleFormat(content) };
    case 'draft':
      try {
        const draft = await handleDraft(content, { title, excerpt, category });
        return { status: 201, payload: { ...draft, message: 'Draft salvat în Supabase.' } };
      } catch (err) {
        return {
          status: 503,
          payload: { error: err.message, mock: true },
        };
      }
    default:
      return {
        status: 400,
        payload: { error: 'Invalid action. Use seo | format | draft.' },
      };
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'openclaw-gateway',
        workspace: WORKSPACE,
        workspaceFiles: {
          soul: fs.existsSync(path.join(WORKSPACE, 'SOUL.md')),
          agents: fs.existsSync(path.join(WORKSPACE, 'AGENTS.md')),
          tools: fs.existsSync(path.join(WORKSPACE, 'TOOLS.md')),
        },
        configured: {
          llm: Boolean(LLM_API_KEY),
          supabase: Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY),
        },
      });
    }

    if (req.method === 'POST' && (req.url === '/v1/run' || req.url === '/api/run')) {
      const body = await parseJsonBody(req);
      const { status, payload } = await handleRun(body);
      return sendJson(res, status, payload);
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('[openclaw]', err);
    sendJson(res, 500, { error: err.message || 'Internal error' });
  }
});

if (!fs.existsSync(WORKSPACE)) {
  fs.mkdirSync(WORKSPACE, { recursive: true, mode: 0o700 });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[openclaw] gateway :${PORT} | workspace: ${WORKSPACE}`);
});
