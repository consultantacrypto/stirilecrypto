/**
 * Read-only check: the local QuickExit wallet catalog must match main.
 * Fetches the source files from GitHub. Does not write, and does not touch quickexit-app.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  applyStirilecryptoUtmSource,
  sourcesMatchExceptSiteUtm,
  urlsMatchExceptUtmSource,
} from './wallets-sync-compare.mjs';

const LOCAL = resolve('lib/wallets/quickexit-catalog.sync.ts');
const REPO = 'consultantacrypto/quickexit-app';
const SOURCES = ['lib/walletCatalog.ts', 'lib/walletBrands.ts'];

const BRANDS_IMPORT = `import {
  filterWalletProducts,
  hasRealCheckoutCode,
  type WalletBrandSlug,
  type WalletDeviceType,
  type WalletProduct,
  type WalletTier,
} from "./walletCatalog";
`;

function section(text, name) {
  const begin = `// --- BEGIN ${name} ---`;
  const end = `// --- END ${name} ---`;
  const start = text.indexOf(begin);
  const stop = text.indexOf(end);
  if (start < 0 || stop < 0 || stop < start) {
    throw new Error(`missing section markers for ${name}`);
  }
  return text.slice(start + begin.length, stop).replace(/^\n/, '').replace(/\n+$/, '');
}

function headerCommit(text) {
  const match = text.match(/sourceCommit:\s*([0-9a-f]{40})/);
  if (!match) throw new Error('local file has no sourceCommit');
  return match[1];
}

async function githubJson(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      accept: 'application/vnd.github+json',
      'user-agent': 'stirilecrypto-wallets-sync-check',
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub ${path} returned HTTP ${response.status}`);
  }
  return response.json();
}

async function rawFile(commit, path) {
  const url = `https://raw.githubusercontent.com/${REPO}/${commit}/${path}`;
  const response = await fetch(url, { headers: { 'user-agent': 'stirilecrypto-wallets-sync-check' } });
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return response.text();
}

function normalizeBrands(source) {
  if (!source.includes(BRANDS_IMPORT)) {
    throw new Error('lib/walletBrands.ts no longer has the expected ./walletCatalog import');
  }
  return source.replace(BRANDS_IMPORT, '').replace(/\n+$/, '');
}

const local = readFileSync(LOCAL, 'utf8');
const pinned = headerCommit(local);
const main = await githubJson(`/repos/${REPO}/commits/main`);
const mainSha = main.sha;
if (typeof mainSha !== 'string' || !/^[0-9a-f]{40}$/.test(mainSha)) {
  throw new Error('GitHub did not return a main commit SHA');
}
if (mainSha !== pinned) {
  console.log(`quickexit-app main is ${mainSha}; the copy records ${pinned}. Comparing the wallet files on main.`);
}

const remoteCatalog = (await rawFile(mainSha, SOURCES[0])).replace(/\n$/, '');
const remoteBrands = normalizeBrands(await rawFile(mainSha, SOURCES[1]));
const localCatalog = section(local, SOURCES[0]);
const localBrands = section(local, SOURCES[1]);

let failed = false;
if (!sourcesMatchExceptSiteUtm(localCatalog, remoteCatalog)) {
  console.error(`${SOURCES[0]} differs from quickexit-app@${mainSha} beyond utm_source`);
  failed = true;
}
if (!sourcesMatchExceptSiteUtm(localBrands, remoteBrands)) {
  console.error(`${SOURCES[1]} differs from quickexit-app@${mainSha} (import of ./walletCatalog removed in the local copy)`);
  failed = true;
}

if (!failed) {
  const mismatch = compareOutboundUrls(remoteCatalog);
  if (mismatch) {
    console.error(mismatch);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`wallets catalog matches ${REPO}@${mainSha} except the site utm_source`);

function compareOutboundUrls(remoteCatalogSource) {
  const dir = mkdtempSync(join(tmpdir(), 'wallets-sync-'));
  const remotePath = join(dir, 'walletCatalog.ts');
  writeFileSync(remotePath, `${remoteCatalogSource}\n`);
  const remoteHref = pathToFileURL(remotePath).href;
  const localHref = pathToFileURL(resolve('lib/wallets/quickexit-catalog.sync.ts')).href;
  const code = `
    import { WALLET_PRODUCTS as remoteProducts, buildWalletOutboundUrl as remoteBuild } from ${JSON.stringify(remoteHref)};
    import { WALLET_PRODUCTS as localProducts, buildWalletOutboundUrl as localBuild } from ${JSON.stringify(localHref)};
    const localBySlug = new Map(localProducts.map((product) => [product.slug, product]));
    const rows = remoteProducts.map((product) => ({
      slug: product.slug,
      quickexit: remoteBuild(product),
      local: localBySlug.has(product.slug) ? localBuild(localBySlug.get(product.slug)) : null,
    }));
    process.stdout.write(JSON.stringify({ remoteCount: remoteProducts.length, localCount: localProducts.length, rows }));
  `;
  const child = spawnSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '--eval', code], {
    encoding: 'utf8',
  });
  rmSync(dir, { recursive: true, force: true });
  if (child.status !== 0) {
    return `could not compare outbound URLs\n${child.stderr}`;
  }
  const parsed = JSON.parse(child.stdout);
  if (parsed.remoteCount !== parsed.localCount) {
    return `wallet variant count differs: QE ${parsed.remoteCount}, local ${parsed.localCount}`;
  }
  const rows = parsed.rows.map((row) => ({
    ...row,
    local: row.local ? applyStirilecryptoUtmSource(row.local) : null,
  }));
  const broken = rows.filter((row) => !row.local || !urlsMatchExceptUtmSource(row.quickexit, row.local));
  if (broken.length === 0) return '';
  return broken
    .slice(0, 5)
    .map((row) => `${row.slug}\n  QE ${row.quickexit}\n  SC ${row.local}`)
    .join('\n');
}
