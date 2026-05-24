'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Loader2, ImageIcon, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { uploadImageFile } from '@/lib/upload-client';

const BUCKET = 'imagini-stiri';

export type MediaFile = {
  name: string;
  url: string;
};

type MediaLibraryModalProps = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

function isImageFile(name: string): boolean {
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(name);
}

export default function MediaLibraryModal({ onSelect, onClose }: MediaLibraryModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: listError } = await supabase.storage.from(BUCKET).list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (listError) {
        throw new Error(listError.message);
      }

      const images: MediaFile[] = (data ?? [])
        .filter((item) => item.name && item.id !== null && isImageFile(item.name))
        .map((item) => {
          const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(item.name);
          return { name: item.name, url: urlData.publicUrl };
        });

      setFiles(images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nu am putut încărca galeria.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Doar fișiere imagine sunt permise.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await uploadImageFile(file);
      await fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload eșuat.');
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Media Library"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-[#0a0f1e] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={20} className="text-blue-400" />
            <h2 className="text-lg font-bold text-white font-[var(--font-space)]">
              Media Library
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchFiles()}
              disabled={loading || uploading}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
              title="Reîncarcă"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Închide"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-white/10">
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) void uploadFile(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/15 bg-[#1c1c1e] hover:border-white/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadFile(file);
                e.target.value = '';
              }}
            />
            {uploading ? (
              <>
                <Loader2 size={24} className="animate-spin text-blue-400" />
                <p className="text-sm text-slate-400">Se încarcă...</p>
              </>
            ) : (
              <>
                <Upload size={24} className="text-slate-500" />
                <p className="text-sm text-slate-400">
                  Trage o imagine sau click pentru upload în{' '}
                  <span className="text-blue-400 font-mono">imagini-stiri</span>
                </p>
              </>
            )}
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
              <Loader2 size={20} className="animate-spin" />
              Se încarcă galeria...
            </div>
          ) : files.length === 0 ? (
            <p className="text-center text-slate-500 py-16 text-sm">
              Nicio imagine în bucket. Încarcă prima imagine mai sus.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {files.map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => handleSelect(file.url)}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black hover:border-blue-500/50 hover:ring-2 hover:ring-blue-500/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-1.5 text-[10px] text-slate-300 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
