import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TOPIC_HUBS } from './topic-hubs';

describe('topic hub titles', () => {
  it('uses the brief title, H1, and description for each hub', () => {
    assert.equal(
      TOPIC_HUBS.mica.title,
      'MiCA în România 2026: exchange-uri autorizate, USDT și taxe crypto',
    );
    assert.equal(
      TOPIC_HUBS.mica.h1,
      'MiCA în România: ce exchange-uri sunt autorizate și ce faci cu banii',
    );
    assert.match(TOPIC_HUBS.mica.description, /USDT/);

    assert.equal(
      TOPIC_HUBS.bitcoin.title,
      'Știri Bitcoin România: analize și Pulsul Bitcoin, în română',
    );
    assert.equal(TOPIC_HUBS.bitcoin.h1, 'Știri Bitcoin în română, pentru cititorii din România');
    assert.match(TOPIC_HUBS.bitcoin.description, /7 zile din 7/);

    assert.equal(
      TOPIC_HUBS.securitate.title,
      'Țepe crypto în România: cum le recunoști și ce faci dacă ai fost păcălit',
    );
    assert.equal(
      TOPIC_HUBS.securitate.h1,
      'Țepe crypto în România: cum le recunoști înainte să trimiți bani',
    );
    assert.match(TOPIC_HUBS.securitate.description, /fals suport/);
  });
});
