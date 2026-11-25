import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { NEWSLETTER_FORM_DESCRIPTION, NEWSLETTER_SIGNUP_SUCCESS } from './newsletter';

const MISLEADING = /nu trimitem|nu este încă activ|nu primești|nu vei primi|lista de așteptare/i;

describe('newsletter signup copy', () => {
  it('says the person is subscribed, will receive the newsletter, and can unsubscribe', () => {
    assert.match(NEWSLETTER_SIGNUP_SUCCESS, /abonat/i);
    assert.match(NEWSLETTER_SIGNUP_SUCCESS, /vei primi/i);
    assert.match(NEWSLETTER_SIGNUP_SUCCESS, /dezabon/i);
    assert.doesNotMatch(NEWSLETTER_SIGNUP_SUCCESS, MISLEADING);

    assert.match(NEWSLETTER_FORM_DESCRIPTION, /vei primi/i);
    assert.match(NEWSLETTER_FORM_DESCRIPTION, /dezabon/i);
    assert.doesNotMatch(NEWSLETTER_FORM_DESCRIPTION, MISLEADING);
  });

  it('removes the capture-box claim that no messages are sent', () => {
    const box = readFileSync(new URL('../components/EmailCaptureBox.tsx', import.meta.url), 'utf8');
    const morning = readFileSync(new URL('../components/MorningNewsletter.tsx', import.meta.url), 'utf8');
    const route = readFileSync(new URL('../app/api/subscribe/route.ts', import.meta.url), 'utf8');

    assert.equal(box.includes('nu trimitem'), false);
    assert.equal(box.includes('nu este încă activ'), false);
    assert.equal(box.includes('Lista de așteptare'), false);
    assert.equal(box.includes('NEWSLETTER_FORM_DESCRIPTION'), true);
    assert.equal(box.includes('NEWSLETTER_SIGNUP_SUCCESS'), true);
    assert.equal(morning.includes('NEWSLETTER_SIGNUP_SUCCESS'), true);
    assert.equal(route.includes('NEWSLETTER_SIGNUP_SUCCESS'), true);
    assert.equal(route.includes('nu trimitem'), false);
  });
});
