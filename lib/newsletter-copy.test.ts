import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  NEWSLETTER_FORM_DESCRIPTION,
  NEWSLETTER_SIGNUP_DUPLICATE,
  NEWSLETTER_SIGNUP_SUCCESS,
} from './newsletter';

const CONFIRMATION =
  'Ești abonat. Vei primi newsletterul Știrile Crypto o dată pe săptămână, duminica. Te poți dezabona oricând.';

const MISLEADING = /nu trimitem|nu este încă activ|nu primești|nu vei primi|lista de așteptare|de dimineață|dimineața|pe zi/i;

describe('newsletter signup copy', () => {
  it('uses the weekly Sunday confirmation', () => {
    assert.equal(NEWSLETTER_SIGNUP_SUCCESS, CONFIRMATION);
    assert.match(NEWSLETTER_FORM_DESCRIPTION, /o dată pe săptămână, duminica/);
    assert.match(NEWSLETTER_FORM_DESCRIPTION, /dezabon/i);
    assert.doesNotMatch(NEWSLETTER_SIGNUP_SUCCESS, MISLEADING);
    assert.doesNotMatch(NEWSLETTER_FORM_DESCRIPTION, MISLEADING);
    assert.doesNotMatch(NEWSLETTER_SIGNUP_DUPLICATE, MISLEADING);
  });

  it('removes the capture-box claim that no messages are sent', () => {
    const box = readFileSync(new URL('../components/EmailCaptureBox.tsx', import.meta.url), 'utf8');
    const morning = readFileSync(new URL('../components/MorningNewsletter.tsx', import.meta.url), 'utf8');
    const route = readFileSync(new URL('../app/api/subscribe/route.ts', import.meta.url), 'utf8');
    const page = readFileSync(new URL('../app/newsletter/dezabonare/page.tsx', import.meta.url), 'utf8');

    for (const source of [box, morning, route, page]) {
      assert.equal(source.includes('nu trimitem'), false);
      assert.equal(source.includes('de dimineață'), false);
      assert.equal(source.includes('dimineața'), false);
      assert.equal(source.includes('Un email pe zi'), false);
    }
    assert.equal(box.includes('Lista de așteptare'), false);
    assert.equal(box.includes('NEWSLETTER_FORM_DESCRIPTION'), true);
    assert.equal(box.includes('NEWSLETTER_SIGNUP_SUCCESS'), true);
    assert.equal(morning.includes('NEWSLETTER_SIGNUP_SUCCESS'), true);
    assert.equal(morning.includes('o dată pe săptămână, duminica') || morning.includes('pe săptămână, duminica'), true);
    assert.equal(route.includes('NEWSLETTER_SIGNUP_SUCCESS'), true);
  });
});
