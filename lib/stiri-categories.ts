/** Editorial categories offered by the admin article form (`/admin/create`). */
export const ARTICLE_CATEGORIES = [
  'ANALIZĂ TEHNICĂ & MACRO',
  'ON-CHAIN & ANALIZĂ TEHNICĂ',
  'MACRO & ON-CHAIN',
  'MACRO & MINING',
  'PSIHOLOGIE DE PIAȚĂ',
  'REGLEMENTĂRI',
  'DEFI & WEB3',
  'ȘTIRI GENERALE',
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export function canonicalArticleCategory(value: string): ArticleCategory | null {
  const normalized = value.trim().normalize('NFC');
  return ARTICLE_CATEGORIES.find((category) => category.normalize('NFC') === normalized) ?? null;
}
