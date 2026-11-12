import type { Metadata } from 'next';

type Alternates = NonNullable<Metadata['alternates']>;

/** Shared RSS autodiscovery. Route `alternates` replace the layout object, so each canonical includes this. */
export function rssAlternateTypes(): NonNullable<Alternates['types']> {
  return {
    'application/rss+xml': [{ url: '/feed.xml', title: 'Știrile Crypto — RSS' }],
  };
}

export function withRssAlternate(alternates: { canonical: string }): Alternates {
  return {
    ...alternates,
    types: rssAlternateTypes(),
  };
}
