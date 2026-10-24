/** Homepage grid sizes. Kept out of articles-db so the client bundle stays small. */
export const HOME_FEED_FIRST_COUNT = 9;
export const HOME_FEED_PAGE_SIZE = 12;

export interface NewsFeedItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  dateLabel: string;
  href: string;
}
