import imageCompression from 'browser-image-compression';

const COVER_COMPRESSION_OPTIONS = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  fileType: 'image/webp',
} as const;

/** Client-side resize/WebP encode before signed upload (keeps Storage payloads small). */
export async function compressCoverImageForUpload(file: File): Promise<File> {
  const compressedBlob = await imageCompression(file, COVER_COMPRESSION_OPTIONS);
  const webpName = file.name.replace(/\.[^/.]+$/, '.webp') || 'cover.webp';

  return new File([compressedBlob], webpName, { type: 'image/webp' });
}
