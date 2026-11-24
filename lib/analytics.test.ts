import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { deploymentEnv, shouldSendAnalytics, trackEvent } from './analytics';

describe('analytics production gate', () => {
  it('sends only when VERCEL_ENV is production', () => {
    assert.equal(shouldSendAnalytics('production'), true);
    assert.equal(shouldSendAnalytics('preview'), false);
    assert.equal(shouldSendAnalytics('development'), false);
    assert.equal(shouldSendAnalytics(''), false);
    assert.equal(shouldSendAnalytics(undefined), false);
    assert.equal(shouldSendAnalytics(null), false);
  });

  it('reads the deployment env without inventing production', () => {
    const previous = process.env.VERCEL_ENV;
    process.env.VERCEL_ENV = 'preview';
    assert.equal(deploymentEnv(), 'preview');
    process.env.VERCEL_ENV = 'production';
    assert.equal(deploymentEnv(), 'production');
    delete process.env.VERCEL_ENV;
    assert.equal(deploymentEnv(), '');
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  });

  it('does nothing without a browser', () => {
    assert.equal(trackEvent('consultancy_click', { link: 'https://www.mihaidaniel.ro/', placement: 'test' }), undefined);
  });
});
