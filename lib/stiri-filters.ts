export const STIRI_FILTERS = [
  'btc',
  'eth',
  'macro',
  'alts',
  'edu',
  'reglementari',
  'generale',
] as const;

export type StiriFilterId = (typeof STIRI_FILTERS)[number];

export interface StiriFilterArticle {
  title: string;
  summary: string;
  category: string;
}

function blob(article: StiriFilterArticle): string {
  return `${article.title} ${article.summary} ${article.category}`.toLowerCase();
}

function category(article: StiriFilterArticle): string {
  return article.category.toUpperCase();
}

function isBitcoin(article: StiriFilterArticle): boolean {
  return /bitcoin|\bbtc\b|satoshi|halving/.test(blob(article));
}

function isEthereum(article: StiriFilterArticle): boolean {
  return /ethereum|\beth\b|vitalik/.test(blob(article));
}

function isMacro(article: StiriFilterArticle): boolean {
  const text = blob(article);
  const cat = category(article);
  return (
    /fomc|\bfed\b|inflatie|inflație|bancă|banca|\bcpi\b|trezorerie/.test(text) ||
    cat.includes('MACRO') ||
    cat.includes('INSTITUȚ') ||
    cat.includes('INSTITUT')
  );
}

function isAltcoin(article: StiriFilterArticle): boolean {
  const text = blob(article);
  const cat = category(article);
  return /solana|altcoin|altseason|\btoken\b/.test(text) || cat.includes('ADOPȚ') || cat.includes('ADOPT');
}

function isEducation(article: StiriFilterArticle): boolean {
  const cat = category(article);
  return cat.includes('EDUCA') || cat.includes('PSIHOLOG') || cat.includes('SECURIT');
}

function isRegulation(article: StiriFilterArticle): boolean {
  const cat = category(article);
  return /REGLEMENT|LEGISLA|FISCAL|MICA|TAXE|ANAF/.test(cat);
}

const SPECIFIC: Record<Exclude<StiriFilterId, 'generale'>, (article: StiriFilterArticle) => boolean> = {
  btc: isBitcoin,
  eth: isEthereum,
  macro: isMacro,
  alts: isAltcoin,
  edu: isEducation,
  reglementari: isRegulation,
};

export function matchesStiriFilter(article: StiriFilterArticle, filter: string | null): boolean {
  if (!filter || filter === 'all') return true;
  if (filter === 'generale') {
    return !STIRI_FILTERS.some((id) => id !== 'generale' && SPECIFIC[id](article));
  }
  const check = SPECIFIC[filter as Exclude<StiriFilterId, 'generale'>];
  return check ? check(article) : false;
}