import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { NextRequest } from 'next/server';
import { POST } from '../../app/api/editor/images/route';
import {
  EDITOR_IMAGE_MAX_BYTES,
  acceptEditorImage,
  buildEditorImagePath,
  classifyEditorImageContentType,
  contentLengthStatus,
  isDuplicateStorageError,
  isSafeEditorObjectPath,
  parseEditorImageBody,
  publicImageUrl,
  readLimitedBody,
  sniffImageType,
} from './images';

const TOKEN = 'editor-test-token';

function pngBytes(): Uint8Array {
  const bytes = new Uint8Array(24);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52]);
  return bytes;
}

function jpegBytes(): Uint8Array {
  return Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0xff, 0xd9]);
}

function webpBytes(): Uint8Array {
  return Uint8Array.from([
    0x52, 0x49, 0x46, 0x46, 0x08, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20,
  ]);
}

function concat(...parts: Array<string | Uint8Array>): Uint8Array {
  const encoded = parts.map((part) => (typeof part === 'string' ? new TextEncoder().encode(part) : part));
  const out = new Uint8Array(encoded.reduce((sum, part) => sum + part.byteLength, 0));
  let offset = 0;
  for (const part of encoded) {
    out.set(part, offset);
    offset += part.byteLength;
  }
  return out;
}

describe('image sniffing', () => {
  it('accepts WebP, PNG, and JPEG magic and rejects spoofed headers', () => {
    assert.equal(sniffImageType(webpBytes()), 'image/webp');
    assert.equal(sniffImageType(pngBytes()), 'image/png');
    assert.equal(sniffImageType(jpegBytes()), 'image/jpeg');

    const pngPrefix = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x3c, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x3e]);
    assert.equal(sniffImageType(pngPrefix), null);

    const htmlPng = pngBytes();
    htmlPng.set([0x49, 0x44, 0x41, 0x54], 12);
    assert.equal(sniffImageType(htmlPng), null);

    const wave = webpBytes();
    wave.set([0x57, 0x41, 0x56, 0x45], 8);
    assert.equal(sniffImageType(wave), null);

    const webpHtml = webpBytes();
    webpHtml.set([0x48, 0x54, 0x4d, 0x4c], 12);
    assert.equal(sniffImageType(webpHtml), null);

    assert.equal(sniffImageType(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00])), null);
    assert.equal(sniffImageType(Uint8Array.from([0xff, 0xd8, 0xff, 0x00, 0xff, 0xd9])), null);
    assert.equal(sniffImageType(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>')), null);
    assert.equal(sniffImageType(new TextEncoder().encode('GIF89a')), null);
  });
});

describe('editor image paths', () => {
  it('keeps the object key inside editor-covers and rejects traversal', () => {
    const path = buildEditorImagePath('JPM Coin.webp', 'image/webp');
    assert.ok(path);
    assert.match(path, /^editor-covers\/jpm-coin-\d+-[a-f0-9]{8}\.webp$/);
    assert.equal(isSafeEditorObjectPath(path), true);

    const romanian = buildEditorImagePath('Știre de test.png', 'image/png');
    assert.match(romanian ?? '', /^editor-covers\/stire-de-test-\d+-[a-f0-9]{8}\.png$/);

    const renamed = buildEditorImagePath('evil.html', 'image/jpeg');
    assert.match(renamed ?? '', /^editor-covers\/evil-\d+-[a-f0-9]{8}\.jpg$/);

    for (const bad of [
      '../cover.webp',
      '..\\cover.webp',
      'foo/../../etc/passwd',
      'editor-covers/../../secret.webp',
      'a/b.webp',
      'foo\0.webp',
      '..',
      'my..photo.webp',
      `${'a'.repeat(241)}.webp`,
    ]) {
      assert.equal(buildEditorImagePath(bad, 'image/png'), null, bad);
    }

    assert.equal(buildEditorImagePath(null, 'image/jpeg')?.startsWith('editor-covers/cover-'), true);
    assert.equal(isSafeEditorObjectPath('editor-covers/../secret.webp'), false);
    assert.equal(isSafeEditorObjectPath('editor-covers/a.webp?.jpg'), false);
    assert.equal(isSafeEditorObjectPath('/editor-covers/a.webp'), false);
  });

  it('builds a public URL only for a safe key and an http(s) project URL', () => {
    const previous = process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co/';
    try {
      assert.equal(
        publicImageUrl('editor-covers/jpm-coin-1-abcdefab.webp'),
        'https://example.supabase.co/storage/v1/object/public/imagini-stiri/editor-covers/jpm-coin-1-abcdefab.webp',
      );
      assert.equal(publicImageUrl('editor-covers/../secret.webp'), null);
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      assert.equal(publicImageUrl('editor-covers/jpm-coin-1-abcdefab.webp'), null);
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      else process.env.NEXT_PUBLIC_SUPABASE_URL = previous;
    }
  });
});

describe('upload limits', () => {
  it('honors a decimal Content-Length and ignores non-numeric values', () => {
    assert.equal(contentLengthStatus(null, 10), 'ok');
    assert.equal(contentLengthStatus('0', 10), 'empty');
    assert.equal(contentLengthStatus('10', 10), 'ok');
    assert.equal(contentLengthStatus('11', 10), 'too-large');
    assert.equal(contentLengthStatus('1e6', 10), 'ok');
    assert.equal(contentLengthStatus('1, 999', 10), 'ok');
    assert.equal(contentLengthStatus('-1', 10), 'ok');
  });

  it('stops reading once the cap is exceeded', async () => {
    let pulls = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        if (pulls === 1) controller.enqueue(Uint8Array.from([1, 2, 3]));
        else if (pulls === 2) controller.enqueue(Uint8Array.from([4, 5, 6]));
        else controller.enqueue(Uint8Array.from([7]));
      },
    });

    const limited = await readLimitedBody(stream, 4);
    assert.deepEqual(limited, { ok: false, reason: 'too-large' });
    assert.equal(pulls, 2);

    const exact = await readLimitedBody(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(Uint8Array.from([1, 2, 3, 4]));
          controller.close();
        },
      }),
      4,
    );
    assert.equal(exact.ok, true);
    if (exact.ok) assert.deepEqual([...exact.bytes], [1, 2, 3, 4]);
    assert.deepEqual(await readLimitedBody(null, 4), { ok: false, reason: 'empty' });
  });

  it('rejects an image one byte over the cap before trusting its header', () => {
    const big = new Uint8Array(EDITOR_IMAGE_MAX_BYTES + 1);
    big.set(jpegBytes());
    const accepted = acceptEditorImage(big, 'image/jpeg', 'cover.jpg');
    assert.equal(accepted.ok, false);
    if (!accepted.ok) assert.equal(accepted.status, 413);
  });
});

describe('multipart and declared type', () => {
  it('classifies raw and multipart bodies and rejects lookalike media types', () => {
    assert.equal(classifyEditorImageContentType('image/png; charset=binary').ok, true);
    assert.equal(classifyEditorImageContentType('multipart/form-data; boundary=abc').ok, true);
    const raw = classifyEditorImageContentType('Image/JPEG');
    assert.equal(raw.ok, true);
    if (raw.ok && raw.kind === 'raw') assert.equal(raw.declared, 'image/jpeg');
    assert.equal(classifyEditorImageContentType('multipart/form-data-evil').ok, false);
    assert.equal(classifyEditorImageContentType('image/jpegx').ok, false);
    assert.equal(classifyEditorImageContentType('text/html').ok, false);
  });

  it('reads the file part and still rejects a traversed filename', async () => {
    const boundary = '----editorboundary';
    const body = concat(
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="filename"\r\n\r\n',
      '../../etc/passwd\r\n',
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="file"; filename="cover.png"\r\n',
      'Content-Type: image/svg+xml\r\n\r\n',
      pngBytes(),
      `\r\n--${boundary}--\r\n`,
    );
    const parsed = await parseEditorImageBody({
      kind: 'multipart',
      contentType: `multipart/form-data; boundary=${boundary}`,
      body,
      queryFilename: 'safe.webp',
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.name, '../../etc/passwd');
    const accepted = acceptEditorImage(parsed.bytes, null, parsed.name);
    assert.equal(accepted.ok, false);
    if (!accepted.ok) assert.equal(accepted.status, 400);
  });

  it('rejects a raw body whose Content-Type does not match the bytes', () => {
    const mismatch = acceptEditorImage(pngBytes(), 'image/jpeg', 'cover.jpg');
    assert.equal(mismatch.ok, false);
    if (!mismatch.ok) assert.equal(mismatch.status, 415);

    const match = acceptEditorImage(jpegBytes(), 'image/jpeg', 'JPM Coin.jpg');
    assert.equal(match.ok, true);
    if (match.ok) {
      assert.equal(match.mime, 'image/jpeg');
      assert.match(match.path, /\.jpg$/);
    }
  });
});

describe('storage errors', () => {
  it('recognizes a duplicate object without treating other failures as conflicts', () => {
    assert.equal(isDuplicateStorageError({ status: 400, message: 'The resource already exists' }), true);
    assert.equal(isDuplicateStorageError({ status: 409, statusCode: '409', message: 'Duplicate' }), true);
    assert.equal(isDuplicateStorageError({ status: 500, message: 'network unreachable' }), false);
  });
});

describe('POST /api/editor/images', () => {
  it('rejects unauthenticated and unsupported requests before reading the body', async () => {
    const previousToken = process.env.EDITOR_API_TOKEN;
    process.env.EDITOR_API_TOKEN = TOKEN;
    try {
      const unauthorized = await postImage({ authorization: 'Bearer wrong' }, { 'content-type': 'image/png' });
      assert.equal(unauthorized.status, 401);
      assert.ok(unauthorized.readsDuringHandler <= 1);

      const missingConfig = await postImage({}, { 'content-type': 'image/png' }, { token: '' });
      assert.equal(missingConfig.status, 503);
      assert.ok(missingConfig.readsDuringHandler <= 1);

      const unsupported = await postImage(
        { authorization: `Bearer ${TOKEN}` },
        { 'content-type': 'text/html' },
      );
      assert.equal(unsupported.status, 415);
      assert.ok(unsupported.readsDuringHandler <= 1);

      const tooLarge = await postImage(
        { authorization: `Bearer ${TOKEN}` },
        { 'content-type': 'image/png', 'content-length': String(EDITOR_IMAGE_MAX_BYTES + 1) },
      );
      assert.equal(tooLarge.status, 413);
      assert.ok(tooLarge.readsDuringHandler <= 1);

      const authorizedRead = await postImage(
        { authorization: `Bearer ${TOKEN}` },
        { 'content-type': 'image/png' },
      );
      assert.equal(authorizedRead.status, 415);
      assert.ok(authorizedRead.readsDuringHandler > 1);
    } finally {
      restoreEnv('EDITOR_API_TOKEN', previousToken);
    }
  });

  it('checks bytes, filenames, and storage configuration after auth', async () => {
    const previousToken = process.env.EDITOR_API_TOKEN;
    const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.EDITOR_API_TOKEN = TOKEN;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      const spoofed = await postImage(
        { authorization: `Bearer ${TOKEN}`, 'content-type': 'image/png' },
        undefined,
        { body: new TextEncoder().encode('<html></html>') },
      );
      assert.equal(spoofed.status, 415);

      const mismatch = await postImage(
        { authorization: `Bearer ${TOKEN}`, 'content-type': 'image/jpeg' },
        undefined,
        { body: pngBytes() },
      );
      assert.equal(mismatch.status, 415);

      const traversed = await postImage(
        { authorization: `Bearer ${TOKEN}`, 'content-type': 'image/png' },
        undefined,
        { body: pngBytes(), url: 'http://localhost/api/editor/images?filename=../../etc/passwd.png' },
      );
      assert.equal(traversed.status, 400);

      const unconfigured = await postImage(
        { authorization: `Bearer ${TOKEN}`, 'content-type': 'image/png' },
        undefined,
        { body: pngBytes() },
      );
      assert.equal(unconfigured.status, 503);
      assert.deepEqual(unconfigured.json, { error: 'Storage is not configured.' });
    } finally {
      restoreEnv('EDITOR_API_TOKEN', previousToken);
      restoreEnv('NEXT_PUBLIC_SUPABASE_URL', previousUrl);
    }
  });
});

function restoreEnv(name: 'EDITOR_API_TOKEN' | 'NEXT_PUBLIC_SUPABASE_URL', previous: string | undefined) {
  if (previous === undefined) delete process.env[name];
  else process.env[name] = previous;
}

async function postImage(
  headers: Record<string, string>,
  extraHeaders?: Record<string, string>,
  options?: { body?: BodyInit; url?: string; token?: string },
) {
  const previousToken = process.env.EDITOR_API_TOKEN;
  if (options && 'token' in options) {
    if (options.token) process.env.EDITOR_API_TOKEN = options.token;
    else delete process.env.EDITOR_API_TOKEN;
  }

  let readsDuringHandler = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      readsDuringHandler += 1;
      if (readsDuringHandler > 4) {
        controller.close();
        return;
      }
      controller.enqueue(new Uint8Array(32));
    },
  });

  const request = new NextRequest(options?.url ?? 'http://localhost/api/editor/images', {
    method: 'POST',
    headers: { ...headers, ...extraHeaders },
    body: options?.body ?? stream,
    duplex: 'half',
  });
  const before = readsDuringHandler;
  try {
    const response = await POST(request);
    const json = (await response.json()) as { error?: string };
    return { status: response.status, json, readsDuringHandler: readsDuringHandler - before };
  } finally {
    if (options && 'token' in options) restoreEnv('EDITOR_API_TOKEN', previousToken);
  }
}
