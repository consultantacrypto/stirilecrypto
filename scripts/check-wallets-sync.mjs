/**
 * Read-only check: the local QuickExit wallet catalog must match main.
 * Fetches the source files from GitHub. Does not write, and does not touch quickexit-app.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
  console.error(`quickexit-app main is ${mainSha}`);
  console.error(`local copy is pinned to ${pinned}`);
  console.error('The catalog moved. Refresh the synced file and the sourceCommit header.');
  process.exit(1);
}

const remoteCatalog = (await rawFile(mainSha, SOURCES[0])).replace(/\n$/, '');
const remoteBrands = normalizeBrands(await rawFile(mainSha, SOURCES[1]));
const localCatalog = section(local, SOURCES[0]);
const localBrands = section(local, SOURCES[1]);

let failed = false;
if (localCatalog !== remoteCatalog) {
  console.error(`${SOURCES[0]} differs from quickexit-app@${mainSha}`);
  failed = true;
}
if (localBrands !== remoteBrands) {
  console.error(`${SOURCES[1]} differs from quickexit-app@${mainSha} (import of ./walletCatalog removed in the local copy)`);
  failed = true;
}

if (failed) process.exit(1);
console.log(`wallets catalog matches ${REPO}@${mainSha}`);
