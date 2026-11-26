/**
 * Listing titles for /stiri.
 * Page 1 with no category is the only URL aimed at „știri blockchain”.
 * Filtered views keep their own title so they do not inherit that phrase.
 */

export const STIRI_BLOCKCHAIN_TITLE = 'Știri blockchain și crypto';
export const STIRI_BLOCKCHAIN_H1 = 'Știri blockchain și crypto, în română';
export const STIRI_BLOCKCHAIN_DESCRIPTION =
  'Știri blockchain și crypto, traduse și explicate în română: monede, reglementări și noutăți de pe lanț, actualizate zilnic.';

export const STIRI_ALTS_TITLE = 'Știri altcoins și monede alternative';
export const STIRI_ALTS_H1 = 'Știri altcoins și monede alternative';
export const STIRI_ALTS_DESCRIPTION =
  'Știri despre altcoins și alte criptomonede în afara Bitcoin, traduse și explicate în română, actualizate de Știrile Crypto.';

/** Previous shared listing copy. Filtered pages that have no replacement brief keep it. */
export const STIRI_FILTER_TITLE = 'Știri crypto și criptomonede';
export const STIRI_FILTER_H1 = 'Știri crypto și criptomonede';
export const STIRI_FILTER_DESCRIPTION =
  'Știri crypto și criptomonede, plus noutăți blockchain, traduse și explicate în română de Știrile Crypto.';

export type StiriListingSeo = {
  title: string;
  h1: string;
  description: string;
};

export function stiriListingSeo(page: number, category: string | null): StiriListingSeo {
  if (category === 'alts') {
    return {
      title: page >= 2 ? `${STIRI_ALTS_TITLE} — pagina ${page}` : STIRI_ALTS_TITLE,
      h1: STIRI_ALTS_H1,
      description: STIRI_ALTS_DESCRIPTION,
    };
  }

  if (category) {
    return {
      title: page >= 2 ? `Știri crypto explicate — pagina ${page}` : STIRI_FILTER_TITLE,
      h1: STIRI_FILTER_H1,
      description: STIRI_FILTER_DESCRIPTION,
    };
  }

  if (page >= 2) {
    return {
      title: `Știri crypto explicate — pagina ${page}`,
      h1: STIRI_BLOCKCHAIN_H1,
      description: STIRI_FILTER_DESCRIPTION,
    };
  }

  return {
    title: STIRI_BLOCKCHAIN_TITLE,
    h1: STIRI_BLOCKCHAIN_H1,
    description: STIRI_BLOCKCHAIN_DESCRIPTION,
  };
}
