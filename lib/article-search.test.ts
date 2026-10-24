import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { searchArticles } from './article-search';

const items = [
  { title: 'Bitcoin cade sub 80.000', summary: 'O zi roșie pe piață.' },
  { title: 'Ethereum și staking', summary: 'Ce înseamnă un validator.' },
];

describe('article search', () => {
  it('matches title or excerpt and ignores a one-letter query', () => {
    assert.equal(searchArticles(items, 'b').length, 0);
    assert.equal(searchArticles(items, 'bitcoin').length, 1);
    assert.equal(searchArticles(items, 'validator')[0]?.title, 'Ethereum și staking');
  });
});
