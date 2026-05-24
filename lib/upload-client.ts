/**
 * Browser helper — posts cover images to the authenticated /api/upload route.
 */
export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? 'Upload eșuat.');
  }

  if (!data.url?.trim()) {
    throw new Error('Serverul nu a returnat URL-ul imaginii.');
  }

  return data.url.trim();
}
