export type SearchableArticle = {
  title: string;
  summary: string;
};

export function searchArticles<T extends SearchableArticle>(items: T[], query: string): T[] {
  const needle = query.trim().toLocaleLowerCase('ro');
  if (needle.length < 2) return [];
  return items.filter((item) => {
    const title = item.title.toLocaleLowerCase('ro');
    const summary = item.summary.toLocaleLowerCase('ro');
    return title.includes(needle) || summary.includes(needle);
  });
}
