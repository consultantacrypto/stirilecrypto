'use client';

import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { prepareImageUrlForStorage } from '@/lib/image-url';
import { compressCoverImageForUpload } from '@/lib/storage/compress-cover-image';
import { uploadCoverImageSigned } from '@/lib/storage/signed-upload-client';
import { slugify } from '@/lib/slugify';
import { revalidateInterviewsAction } from '@/app/admin/interviuri/actions';
import type { Interview, InterviewStatus } from '@/lib/types/interviews';
import { INTERVIEW_BADGE_OPTIONS } from '@/lib/types/interviews';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse bg-gray-800 rounded-xl border border-white/10" />
  ),
});

const MediaLibraryModal = dynamic(() => import('@/components/admin/MediaLibraryModal'), {
  ssr: false,
});

type FormState = {
  title: string;
  slug: string;
  guest_name: string;
  excerpt: string;
  content: string;
  cover_image: string;
  badge: string;
  status: InterviewStatus;
};

const emptyForm: FormState = {
  title: '',
  slug: '',
  guest_name: '',
  excerpt: '',
  content: '',
  cover_image: '',
  badge: 'EXCLUSIV',
  status: 'draft',
};

function formFromInterview(interview: Interview): FormState {
  return {
    title: interview.title,
    slug: interview.slug,
    guest_name: interview.guest_name,
    excerpt: interview.excerpt,
    content: interview.content,
    cover_image: interview.cover_image ?? '',
    badge: interview.badge,
    status: interview.status,
  };
}

export type AdminInterviewFormProps = {
  mode: 'create' | 'edit';
  initialData?: Interview;
};

export default function AdminInterviewForm({ mode, initialData }: AdminInterviewFormProps) {
  const router = useRouter();
  const isEditing = mode === 'edit' && Boolean(initialData?.id);

  const [interviewId, setInterviewId] = useState<string | undefined>(initialData?.id);
  const [form, setForm] = useState<FormState>(
    initialData ? formFromInterview(initialData) : emptyForm,
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData));
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.cover_image ?? null,
  );
  const [coverLibraryOpen, setCoverLibraryOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<File | null>(null);
  const formRef = useRef(form);
  const persistedCoverUrlRef = useRef<string | null>(
    prepareImageUrlForStorage(initialData?.cover_image ?? ''),
  );

  formRef.current = form;

  const patchForm = useCallback((patch: Partial<FormState>) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      formRef.current = next;
      return next;
    });
    setError(null);
    setSuccess(null);
  }, []);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    patchForm({ [key]: value } as Partial<FormState>);
  };

  /** Writes Supabase public URL into form state + ref before submit. */
  const applyCoverImageUrl = useCallback(
    (url: string) => {
      const stored = prepareImageUrlForStorage(url) ?? url.trim();
      persistedCoverUrlRef.current = stored;

      setCoverPreview((prev) => {
        if (prev?.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return stored;
      });

      coverFileRef.current = null;
      setCoverFile(null);
      patchForm({ cover_image: stored });
    },
    [patchForm],
  );

  const handleTitleChange = (title: string) => {
    updateField('title', title);
    if (!slugTouched) {
      updateField('slug', slugify(title));
    }
  };

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setError('Fișierul trebuie să fie o imagine (JPG, PNG, WebP).');
        return;
      }

      setIsUploading(true);
      setError(null);
      setSuccess(null);

      try {
        const compressedFile = await compressCoverImageForUpload(file);
        const url = await uploadCoverImageSigned(compressedFile);
        applyCoverImageUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload eșuat.');
      } finally {
        setIsUploading(false);
      }
    },
    [applyCoverImageUrl],
  );

  const selectCoverFromLibrary = (url: string) => {
    applyCoverImageUrl(url);
    setCoverLibraryOpen(false);
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Titlul este obligatoriu.';
    if (!form.slug.trim()) return 'Slug-ul este obligatoriu.';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      return 'Slug-ul poate conține doar litere mici, cifre și cratime.';
    }
    if (!form.guest_name.trim()) return 'Numele invitatului este obligatoriu.';
    if (!form.excerpt.trim()) return 'Excerpt-ul este obligatoriu.';
    const contentText = form.content.replace(/<[^>]*>/g, '').trim();
    if (!contentText) return 'Conținutul interviului este obligatoriu.';
    if (!form.cover_image.trim() && !persistedCoverUrlRef.current) {
      return 'Încarcă o imagine de copertă.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      let coverImage: string | null = prepareImageUrlForStorage(formRef.current.cover_image);

      if (!coverImage && coverFileRef.current) {
        setIsUploading(true);
        coverImage = await uploadCoverImageSigned(coverFileRef.current);
        setIsUploading(false);
        applyCoverImageUrl(coverImage);
      }

      if (!coverImage) {
        coverImage = persistedCoverUrlRef.current;
      }

      if (!coverImage) {
        throw new Error('Imaginea de copertă lipsește sau URL-ul este invalid.');
      }

      const current = formRef.current;
      const payload = {
        title: current.title.trim(),
        slug: current.slug.trim(),
        guest_name: current.guest_name.trim(),
        excerpt: current.excerpt.trim(),
        content: current.content.trim(),
        cover_image: coverImage,
        badge: current.badge.trim().toUpperCase() || 'EXCLUSIV',
        status: current.status,
      };

      const savedForm: FormState = { ...current, cover_image: coverImage };

      const supabase = createClient();

      if (interviewId) {
        const { error: updateError } = await supabase
          .from('interviews')
          .update(payload)
          .eq('id', interviewId);

        if (updateError) throw new Error(updateError.message);

        patchForm(savedForm);

        setSuccess(
          savedForm.status === 'published'
            ? 'Interviu actualizat și publicat!'
            : 'Draft actualizat cu succes!',
        );
      } else {
        const { data, error: insertError } = await supabase
          .from('interviews')
          .insert(payload)
          .select('id')
          .single();

        if (insertError) throw new Error(insertError.message);
        if (!data) throw new Error('Nu s-a returnat ID-ul interviului.');

        patchForm(savedForm);

        setSuccess(
          savedForm.status === 'published'
            ? 'Interviu publicat cu succes!'
            : 'Draft salvat cu succes!',
        );
        await revalidateInterviewsAction();
        router.push('/admin/interviuri');
        router.refresh();
        return;
      }

      await revalidateInterviewsAction();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvare.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const submitLabel = isEditing ? 'Actualizează interviul' : 'Salvează interviul';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm"
        >
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Titlu interviu
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            placeholder="Titlul editorial al interviului"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Slug (URL)
          </label>
          <input
            id="slug"
            type="text"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              updateField('slug', slugify(e.target.value));
            }}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
          <p className="text-xs text-slate-600 font-mono">/interviuri/{form.slug || 'slug'}</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="guest_name" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Invitat
          </label>
          <input
            id="guest_name"
            type="text"
            value={form.guest_name}
            onChange={(e) => updateField('guest_name', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            placeholder="ex: Ben Zhou"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="badge" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Badge
          </label>
          <select
            id="badge"
            value={form.badge}
            onChange={(e) => updateField('badge', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            {INTERVIEW_BADGE_OPTIONS.map((badge) => (
              <option key={badge} value={badge}>
                {badge}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => updateField('status', e.target.value as InterviewStatus)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="excerpt" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Excerpt (card &amp; intro)
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white resize-y focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            placeholder="Rezumat scurt pentru carduri și header"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Conținut interviu (Q&amp;A)
          </span>
          <p className="text-xs text-slate-500 font-[var(--font-inter)]">
            Editor vizual TipTap — conținutul se salvează ca HTML în Supabase.
          </p>
          <RichTextEditor
            value={form.content}
            onChange={(html) => updateField('content', html)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Imagine copertă
        </span>
        <div className="rounded-2xl border border-white/10 bg-[#1c1c1e] p-5 space-y-4">
          {coverPreview || form.cover_image ? (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.cover_image || coverPreview || ''}
                  alt="Previzualizare copertă"
                  className="h-full w-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 size={24} className="animate-spin text-violet-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setCoverLibraryOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-violet-500/40 transition-colors"
                >
                  <ImageIcon size={16} />
                  Schimbă imaginea
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <Upload size={14} />
                  Sau încarcă fișier local
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCoverLibraryOpen(true)}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 px-6 py-10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-colors"
            >
              <ImageIcon size={32} className="text-violet-400" />
              <span className="text-sm font-bold text-white">Selectează coperta</span>
              <span className="text-xs text-slate-500">Media Library (imagini-stiri)</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {coverLibraryOpen && (
          <MediaLibraryModal
            onClose={() => setCoverLibraryOpen(false)}
            onSelect={selectCoverFromLibrary}
          />
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {(isSubmitting || isUploading) && <Loader2 size={18} className="animate-spin" />}
          {isUploading ? 'Se încarcă imaginea...' : isSubmitting ? 'Se salvează...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
