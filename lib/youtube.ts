/** Handle already linked from the footer and structured data. */
export const DANIEL_YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@DanielMihaiCrypto';

/**
 * Homepage video embed.
 * The repo stores the channel handle above, not a channel id and not a video id.
 * Paste an 11-character YouTube video id here to embed it on the homepage.
 * Leave this empty until that id is known. Do not invent one.
 */
export const HOMEPAGE_YOUTUBE_VIDEO_ID = '';

export function homepageYoutubeEmbedId(value: string = HOMEPAGE_YOUTUBE_VIDEO_ID): string | null {
  const id = value.trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
}
