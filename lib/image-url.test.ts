import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { thumbnailImageUrl } from './image-url';

describe('thumbnailImageUrl', () => {
  it('asks Supabase for a resized cover and leaves other URLs alone', () => {
    const original =
      'https://ndnlhmzrflmtqchdrlbh.supabase.co/storage/v1/object/public/imagini-stiri/1792771607552-coinbase-amenda.webp';
    assert.equal(
      thumbnailImageUrl(original, 240),
      'https://ndnlhmzrflmtqchdrlbh.supabase.co/storage/v1/render/image/public/imagini-stiri/1792771607552-coinbase-amenda.webp?width=240&quality=60',
    );
    assert.equal(thumbnailImageUrl('/btccost.jpg', 240), '/btccost.jpg');
    assert.equal(
      thumbnailImageUrl('https://images.unsplash.com/photo-1', 240),
      'https://images.unsplash.com/photo-1',
    );
  });
});
