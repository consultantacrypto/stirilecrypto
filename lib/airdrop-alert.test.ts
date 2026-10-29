import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  AIRDROP_ALERT_SEED,
  bucharestHourMinute,
  deadlinePhase,
  formatDeadlineRo,
  publishedAirdropAlerts,
  rowToAirdropAlert,
  sourceHost,
} from './airdrop-alert';

describe('Airdrop Alert seed', () => {
  it('has the Account Research lot of 20 published rows with https sources', () => {
    assert.equal(AIRDROP_ALERT_SEED.length, 20);
    assert.equal(publishedAirdropAlerts(AIRDROP_ALERT_SEED).length, 20);
    for (const row of AIRDROP_ALERT_SEED) {
      assert.match(row.sourceUrl, /^https:\/\//);
      if (row.sourceUrlSecondary) assert.match(row.sourceUrlSecondary, /^https:\/\//);
      assert.ok(row.note && row.note.length < 220);
      assert.doesNotMatch(row.note ?? '', /pasul|ghid de farming|claim acum/i);
    }
  });

  it('marks Fhenix and Optimum as quests with unconfirmed airdrops', () => {
    const fhenix = AIRDROP_ALERT_SEED.find((row) => row.slug === 'fhenix');
    const optimum = AIRDROP_ALERT_SEED.find((row) => row.slug === 'optimum');
    assert.equal(fhenix?.programType, 'quests');
    assert.equal(optimum?.programType, 'quests');
    assert.match(fhenix?.note ?? '', /neconfirmat/);
    assert.match(optimum?.note ?? '', /neconfirmat/);
  });

  it('marks Bullshot as higher-risk and memecoin-adjacent', () => {
    const bullshot = AIRDROP_ALERT_SEED.find((row) => row.slug === 'bullshot');
    assert.equal(bullshot?.riskLevel, 'higher');
    assert.equal(bullshot?.programType, 'points');
    assert.match(bullshot?.note ?? '', /memecoin/);
    assert.match(bullshot?.note ?? '', /neconfirmat/);
  });

  it('puts the Reya waitlist bonus at 12:00 Romania on 2 Nov 2026', () => {
    const reya = AIRDROP_ALERT_SEED.find((row) => row.slug === 'reya-network');
    assert.ok(reya?.deadlineAt);
    const clock = bucharestHourMinute(reya!.deadlineAt!);
    assert.equal(clock.hour, '12');
    assert.equal(clock.minute, '00');
    assert.equal(deadlinePhase(reya!.deadlineAt!, new Date('2026-10-29T12:00:00.000Z')), 'open');
    assert.equal(deadlinePhase(reya!.deadlineAt!, new Date('2026-11-02T10:00:00.000Z')), 'passed');
    assert.match(formatDeadlineRo(reya!.deadlineAt!), /12:00/);
    assert.match(formatDeadlineRo(reya!.deadlineAt!), /ora României/);
  });

  it('keeps every seed source URL in the SQL schema', () => {
    const sql = readFileSync(new URL('../supabase/airdrop-alerts-schema.sql', import.meta.url), 'utf8');
    for (const row of AIRDROP_ALERT_SEED) {
      assert.ok(sql.includes(row.sourceUrl), row.sourceUrl);
      if (row.sourceUrlSecondary) assert.ok(sql.includes(row.sourceUrlSecondary), row.sourceUrlSecondary);
      assert.ok(sql.includes(`'${row.slug}'`), row.slug);
    }
  });

  it('drops drafts and rows without an https source', () => {
    const draft = rowToAirdropAlert({
      id: '1',
      slug: 'draft-row',
      name: 'Draft',
      program_type: 'points',
      program_status: 'active',
      window_label: 'în curs',
      source_url: 'https://example.com',
      status: 'draft',
      sort_order: 1,
    });
    assert.equal(draft?.publishStatus, 'draft');
    assert.equal(publishedAirdropAlerts(draft ? [draft] : []).length, 0);
    assert.equal(
      rowToAirdropAlert({
        slug: 'bad',
        name: 'Bad',
        program_type: 'airdrop',
        program_status: 'active',
        window_label: 'în curs',
        source_url: 'http://insecure.example',
        status: 'published',
      }),
      null,
    );
  });

  it('shows a short host for a source link', () => {
    assert.equal(sourceHost('https://www.theblock.co/news/defi/example'), 'theblock.co');
  });
});
