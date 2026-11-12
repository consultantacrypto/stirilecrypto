import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SEARCH_AND_CITATION_BOTS, TRAINING_BOTS, buildRobots } from './robots-policy';

describe('robots policy', () => {
  it('keeps the training block unchanged and adds an explicit search group', () => {
    assert.deepEqual(TRAINING_BOTS, [
      'GPTBot',
      'Google-Extended',
      'CCBot',
      'anthropic-ai',
      'ClaudeBot',
    ]);
    const searchBots: readonly string[] = SEARCH_AND_CITATION_BOTS;
    assert.equal(searchBots.includes('Google-Extended'), false);
    assert.equal(searchBots.includes('Googlebot'), true);
    assert.equal(searchBots.includes('OAI-SearchBot'), true);
    assert.equal(searchBots.includes('GrokBot'), true);

    const robots = buildRobots();
    assert.deepEqual(robots.sitemap, [
      'https://www.stirilecrypto.ro/sitemap.xml',
      'https://www.stirilecrypto.ro/news-sitemap.xml',
    ]);
    const training = robots.rules.filter(
      (rule) => rule.userAgent !== '*' && !Array.isArray(rule.userAgent),
    );
    assert.deepEqual(
      training.map((rule) => rule.userAgent),
      [...TRAINING_BOTS],
    );
    assert.ok(
      training.every((rule) => Array.isArray(rule.disallow) && rule.disallow[0] === '/'),
    );
    const search = robots.rules.find((rule) => Array.isArray(rule.userAgent));
    assert.ok(search);
    assert.deepEqual(search.userAgent, [...SEARCH_AND_CITATION_BOTS]);
    assert.equal(search.allow, '/');
  });
});
