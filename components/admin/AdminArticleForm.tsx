'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  Cloud,
  CloudOff,
} from 'lucide-react';
import GoogleSeoPreview from '@/components/admin/GoogleSeoPreview';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse bg-gray-800 rounded-xl border border-white/10" />
  ),
});

const MediaLibraryModal = dynamic(() => import('@/components/admin/MediaLibraryModal'), {
  ssr: false,
});
import { createClient } from '@/lib/supabase/client';
import { prepareImageUrlForStorage } from '@/lib/image-url';
import { compressCoverImageForUpload } from '@/lib/storage/compress-cover-image';
import { uploadCoverImageSigned } from '@/lib/storage/signed-upload-client';
import { slugify } from '@/lib/slugify';
import {
  buildStireWritePayload,
  formatSupabaseWriteError,
  normalizeArticleContentType,
} from '@/lib/admin/stire-payload';
import type { ArticleContentType, ArticleStatus, Stire } from '@/lib/types/stiri';

const CATEGORIES = [
  'ANALIZĂ TEHNICĂ & MACRO',
  'ON-CHAIN & ANALIZĂ TEHNICĂ',
  'MACRO & ON-CHAIN',
  'MACRO & MINING',
  'PSIHOLOGIE DE PIAȚĂ',
  'REGLEMENTĂRI',
  'DEFI & WEB3',
  'ȘTIRI GENERALE',
] as const;

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  content_type: ArticleContentType;
  status: ArticleStatus;
  image_url: string;
  meta_title: string;
  meta_description: string;
};

const emptyForm: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: CATEGORIES[0],
  content_type: 'news',
  status: 'draft',
  image_url: '',
  meta_title: '',
  meta_description: '',
};

function formFromArticle(article: Stire): FormState {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    content_type: normalizeArticleContentType(article.content_type),
    status: article.status,
    image_url: article.image_url ?? '',
    meta_title: article.meta_title ?? '',
    meta_description: article.meta_description ?? '',
  };
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const AUTO_SAVE_DEBOUNCE_MS = 5000;
const AUTO_SAVE_INTERVAL_MS = 30000;

function serializeFormSnapshot(form: FormState): string {
  return JSON.stringify(form);
}

function canAutoSave(form: FormState): boolean {
  const hasTitle = form.title.trim().length > 0;
  const hasContent = form.content.replace(/<[^>]*>/g, '').trim().length > 0;
  return hasTitle || hasContent;
}

/** Auto-save never promotes draft → published; only keeps published if already live in DB. */
function autoSaveStatus(
  articleId: string | undefined,
  persistedStatus: ArticleStatus
): ArticleStatus {
  if (!articleId) return 'draft';
  return persistedStatus === 'published' ? 'published' : 'draft';
}

export type AdminArticleFormProps = {
  initialData?: Stire;
  /** Pre-select editorial format on /admin/create?type=market_pulse */
  initialContentType?: ArticleContentType;
};

export default function AdminArticleForm({
  initialData,
  initialContentType,
}: AdminArticleFormProps) {
  const router = useRouter();
  const initialForm = initialData
    ? formFromArticle(initialData)
    : {
        ...emptyForm,
        content_type: normalizeArticleContentType(initialContentType ?? 'news'),
      };

  const [articleId, setArticleId] = useState<string | undefined>(initialData?.id);
  const [form, setForm] = useState<FormState>(initialForm);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData));
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.image_url ?? null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [coverLibraryOpen, setCoverLibraryOpen] = useState(false);
  const [openClawSeoLoading, setOpenClawSeoLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<File | null>(null);
  const formRef = useRef(form);
  const persistedImageUrlRef = useRef<string | null>(
    prepareImageUrlForStorage(initialData?.image_url ?? ''),
  );
  const persistedStatusRef = useRef<ArticleStatus>(initialData?.status ?? 'draft');
  const publishedAtRef = useRef<string | null>(initialData?.published_at ?? null);
  const lastSavedSnapshotRef = useRef<string>(serializeFormSnapshot(initialForm));
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoSavingRef = useRef(false);
  const performAutoSaveRef = useRef<() => Promise<void>>(async () => {});

  formRef.current = form;
  const isEditing = Boolean(articleId);

  const categoryOptions = useMemo(() => {
    const base = [...CATEGORIES];
    if (form.category && !base.includes(form.category as (typeof CATEGORIES)[number])) {
      return [form.category, ...base];
    }
    return base;
  }, [form.category]);

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

  /** Writes Supabase public URL into form state + ref so auto-save/submit see it immediately. */
  const applyCoverImageUrl = useCallback((url: string) => {
    const stored = prepareImageUrlForStorage(url) ?? url.trim();
    persistedImageUrlRef.current = stored;

    setCoverPreview((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return stored;
    });

    coverFileRef.current = null;
    setCoverFile(null);
    patchForm({ image_url: stored });
  }, [patchForm]);

  const selectCoverFromLibrary = (url: string) => {
    applyCoverImageUrl(url);
    void performAutoSaveRef.current();
  };

  const generateSeoWithOpenClaw = async () => {
    const source =
      form.content.trim() ||
      [form.title, form.excerpt].filter(Boolean).join('\n\n');

    if (!source.trim()) {
      setError('Adaugă conținut în editor sau un titlu înainte de a genera SEO.');
      return;
    }

    setOpenClawSeoLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/openclaw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seo', content: source }),
      });

      const data = (await res.json()) as {
        metaTitle?: string;
        metaDescription?: string;
        error?: string;
        mock?: boolean;
      };

      if (!res.ok) {
        throw new Error(data.error ?? 'OpenClaw nu a putut genera SEO.');
      }

      if (data.metaTitle) updateField('meta_title', data.metaTitle);
      if (data.metaDescription) updateField('meta_description', data.metaDescription);

      setSuccess(
        data.mock
          ? 'SEO generat (mod demo OpenClaw — configurează OPENCLAW_API_URL și OPENCLAW_API_KEY).'
          : 'SEO generat cu OpenClaw.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la generarea SEO.');
    } finally {
      setOpenClawSeoLoading(false);
    }
  };

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
        void performAutoSaveRef.current();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload eșuat.');
      } finally {
        setIsUploading(false);
      }
    },
    [applyCoverImageUrl],
  );

  const resolvePayloadImageUrl = useCallback((current: FormState): string | null => {
    const fromForm = prepareImageUrlForStorage(current.image_url);
    if (fromForm) return fromForm;
    if (coverFileRef.current) return persistedImageUrlRef.current;
    return null;
  }, []);

  const buildPayload = useCallback(
    (current: FormState, imageUrl: string | null, status: ArticleStatus) => {
      const publishedAt =
        status === 'published'
          ? publishedAtRef.current ?? new Date().toISOString()
          : null;

      return buildStireWritePayload({
        title: current.title,
        slug: current.slug.trim() || slugify(current.title) || `draft-${Date.now()}`,
        excerpt: current.excerpt,
        content: current.content,
        category: current.category,
        content_type: current.content_type,
        status,
        image_url: imageUrl,
        published_at: publishedAt,
        meta_title: current.meta_title,
        meta_description: current.meta_description,
      });
    },
    [],
  );

  const performAutoSave = useCallback(async () => {
    if (isAutoSavingRef.current || isSubmitting || isUploading) return;

    const current = formRef.current;
    const snapshot = serializeFormSnapshot(current);

    if (snapshot === lastSavedSnapshotRef.current) return;
    if (!canAutoSave(current)) return;

    isAutoSavingRef.current = true;
    setSaveStatus('saving');

    try {
      const status = autoSaveStatus(articleId, persistedStatusRef.current);
      const payload = buildPayload(current, resolvePayloadImageUrl(current), status);
      const supabase = createClient();

      if (articleId) {
        const { error: updateError } = await supabase
          .from('stiri')
          .update(payload)
          .eq('id', articleId);

        if (updateError) {
          throw new Error(formatSupabaseWriteError(updateError, 'update'));
        }
        lastSavedSnapshotRef.current = serializeFormSnapshot(formRef.current);
      } else {
        const { data, error: insertError } = await supabase
          .from('stiri')
          .insert(payload)
          .select('id, slug, status, published_at, content_type')
          .single();

        if (insertError) {
          throw new Error(formatSupabaseWriteError(insertError, 'insert'));
        }
        if (!data) throw new Error('Nu s-a returnat ID-ul articolului.');

        setArticleId(data.id as string);
        persistedStatusRef.current = (data.status as ArticleStatus) ?? 'draft';
        publishedAtRef.current = (data.published_at as string | null) ?? null;

        const syncedForm: FormState = {
          ...current,
          slug: data.slug as string,
          status: persistedStatusRef.current,
          content_type: normalizeArticleContentType(data.content_type ?? current.content_type),
        };

        setForm(syncedForm);
        lastSavedSnapshotRef.current = serializeFormSnapshot(syncedForm);

        router.replace(`/admin/edit/${data.id}`, { scroll: false });
      }
      setLastSavedTime(new Date());
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Auto-save eșuat.');
    } finally {
      isAutoSavingRef.current = false;
    }
  }, [articleId, buildPayload, isSubmitting, isUploading, resolvePayloadImageUrl, router]);

  useEffect(() => {
    performAutoSaveRef.current = performAutoSave;
  }, [performAutoSave]);

  useEffect(() => {
    const snapshot = serializeFormSnapshot(form);
    if (snapshot === lastSavedSnapshotRef.current) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      void performAutoSave();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [form, performAutoSave]);

  useEffect(() => {
    const interval = setInterval(() => {
      void performAutoSave();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [performAutoSave]);

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Titlul este obligatoriu.';
    if (!form.slug.trim()) return 'Slug-ul este obligatoriu.';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      return 'Slug-ul poate conține doar litere mici, cifre și cratime.';
    }
    if (!form.excerpt.trim()) return 'Excerpt-ul este obligatoriu.';
    const contentText = form.content.replace(/<[^>]*>/g, '').trim();
    if (!contentText) return 'Conținutul este obligatoriu.';
    if (!form.category) return 'Selectează o categorie.';
    if (!form.image_url.trim() && !persistedImageUrlRef.current) {
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
      let imageUrl: string | null = prepareImageUrlForStorage(formRef.current.image_url);

      if (!imageUrl && coverFileRef.current) {
        setIsUploading(true);
        imageUrl = await uploadCoverImageSigned(coverFileRef.current);
        setIsUploading(false);
        applyCoverImageUrl(imageUrl);
      }

      if (!imageUrl) {
        imageUrl = persistedImageUrlRef.current;
      }

      if (!imageUrl) {
        throw new Error('Imaginea de copertă lipsește sau URL-ul este invalid.');
      }

      if (form.status === 'published' && !publishedAtRef.current) {
        publishedAtRef.current = new Date().toISOString();
      }
      if (form.status === 'draft') {
        publishedAtRef.current = null;
      }

      const savedForm: FormState = { ...formRef.current, image_url: imageUrl };
      const payload = buildPayload(savedForm, imageUrl, savedForm.status);
      const supabase = createClient();

      if (articleId) {
        const { error: updateError } = await supabase
          .from('stiri')
          .update(payload)
          .eq('id', articleId);

        if (updateError) {
          throw new Error(formatSupabaseWriteError(updateError, 'update'));
        }

        patchForm({
          ...savedForm,
          content_type: normalizeArticleContentType(savedForm.content_type),
        });
        persistedStatusRef.current = savedForm.status;
        lastSavedSnapshotRef.current = serializeFormSnapshot({
          ...savedForm,
          content_type: normalizeArticleContentType(savedForm.content_type),
        });

        setSuccess(
          savedForm.status === 'published'
            ? 'Articol actualizat și publicat!'
            : 'Draft actualizat cu succes!'
        );
        router.refresh();
      } else {
        const { data, error: insertError } = await supabase
          .from('stiri')
          .insert(payload)
          .select('id, slug, status, published_at, content_type')
          .single();

        if (insertError) {
          throw new Error(formatSupabaseWriteError(insertError, 'insert'));
        }

        if (data) {
          setArticleId(data.id as string);
          persistedStatusRef.current = savedForm.status;
          publishedAtRef.current = (data.published_at as string | null) ?? publishedAtRef.current;
          router.replace(`/admin/edit/${data.id}`, { scroll: false });
        }

        patchForm({
          ...savedForm,
          content_type: normalizeArticleContentType(
            data?.content_type ?? savedForm.content_type,
          ),
        });
        lastSavedSnapshotRef.current = serializeFormSnapshot({
          ...savedForm,
          content_type: normalizeArticleContentType(
            data?.content_type ?? savedForm.content_type,
          ),
        });

        setSuccess(
          savedForm.status === 'published'
            ? 'Articol publicat cu succes!'
            : 'Draft salvat cu succes!'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvare.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const submitLabel = isEditing ? 'Actualizează Articolul' : 'Salvează Articolul';

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
            Titlu
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Titlul articolului"
          />
        </div>

        <div className="md:col-span-2 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Format Editorial
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                form.content_type === 'news'
                  ? 'border-blue-500/40 bg-blue-500/10 text-white'
                  : 'border-white/10 bg-[#1c1c1e] text-slate-400 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="content_type"
                value="news"
                checked={form.content_type === 'news'}
                onChange={() => updateField('content_type', 'news')}
                className="sr-only"
              />
              <span className="text-sm font-semibold">Știre Standard</span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                form.content_type === 'market_pulse'
                  ? 'border-amber-500/40 bg-amber-500/10 text-white'
                  : 'border-white/10 bg-[#1c1c1e] text-slate-400 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="content_type"
                value="market_pulse"
                checked={form.content_type === 'market_pulse'}
                onChange={() => updateField('content_type', 'market_pulse')}
                className="sr-only"
              />
              <span className="text-sm font-semibold">Market Pulse</span>
            </label>
          </div>
          {form.content_type === 'market_pulse' ? (
            <p className="text-xs text-amber-200/80 font-[var(--font-inter)]">
              Apare în secțiunea dedicată de pe homepage și la{' '}
              <span className="font-mono text-amber-300">/market-pulse/[slug]</span> — nu în grila de
              știri.
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Categorie
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
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
            onChange={(e) => updateField('status', e.target.value as ArticleStatus)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="excerpt" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Descriere scurtă pentru carduri și SEO"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Conținut (editor vizual)
          </span>
          <p className="text-xs text-slate-500 font-[var(--font-inter)]">
            Formatare Notion-style. Linkurile affiliate se adaugă din toolbar (iconița Link). Conținutul
            se salvează ca HTML în Supabase.
          </p>
          <RichTextEditor
            value={form.content}
            onChange={(html) => updateField('content', html)}
          />
        </div>

        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#0a0f1e]/80 p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 font-[var(--font-space)]">
              SEO &amp; Metadata
            </h3>
            <p className="mt-1 text-xs text-slate-500 font-[var(--font-inter)]">
              Optimizează cum apare articolul în Google și pe rețelele sociale.
            </p>
          </div>

          <GoogleSeoPreview
            slug={form.slug}
            metaTitle={form.meta_title}
            metaDescription={form.meta_description}
            title={form.title}
            excerpt={form.excerpt}
          />

          <button
            type="button"
            onClick={() => void generateSeoWithOpenClaw()}
            disabled={openClawSeoLoading}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            {openClawSeoLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                OpenClaw analizează...
              </>
            ) : (
              <>🪄 Generează SEO cu OpenClaw</>
            )}
          </button>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="seo-slug"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Custom Slug (URL)
              </label>
              <input
                id="seo-slug"
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  updateField('slug', slugify(e.target.value));
                }}
                className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="slug-articol-personalizat"
              />
              <p className="text-xs text-slate-600 font-mono">/stiri/{form.slug || 'slug'}</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="meta_title"
                className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                <span>Meta Title</span>
                <span className="font-normal normal-case text-slate-600">
                  {form.meta_title.length}/60 recomandat
                </span>
              </label>
              <input
                id="meta_title"
                type="text"
                maxLength={120}
                value={form.meta_title}
                onChange={(e) => updateField('meta_title', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder={form.title || 'Titlu pentru Google (lasă gol = titlul articolului)'}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="meta_description"
                className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                <span>Meta Description</span>
                <span className="font-normal normal-case text-slate-600">
                  {form.meta_description.length}/160 recomandat
                </span>
              </label>
              <textarea
                id="meta_description"
                rows={3}
                maxLength={320}
                value={form.meta_description}
                onChange={(e) => updateField('meta_description', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder={form.excerpt || 'Descriere pentru Google (lasă gol = excerpt)'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Imagine copertă
        </span>
        <div className="rounded-2xl border border-white/10 bg-[#1c1c1e] p-5 space-y-4">
          {coverPreview || form.image_url ? (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image_url || coverPreview || ''}
                  alt="Previzualizare copertă"
                  className="h-full w-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 size={24} className="animate-spin text-blue-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setCoverLibraryOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-blue-500/40 transition-colors"
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
              className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 px-6 py-10 hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors"
            >
              <ImageIcon size={32} className="text-blue-400" />
              <span className="text-sm font-bold text-white">Select Cover Image</span>
              <span className="text-xs text-slate-500">Din Media Library (imagini-stiri)</span>
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <p
          className="flex items-center gap-2 text-xs text-slate-500 font-[var(--font-inter)] min-h-[1.25rem]"
          aria-live="polite"
        >
          {saveStatus === 'saving' && (
            <>
              <Cloud size={14} className="text-blue-400 animate-pulse" />
              <span>Se salvează automat...</span>
            </>
          )}
          {saveStatus === 'saved' && lastSavedTime && (
            <>
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>
                ✓ Salvat automat la{' '}
                {lastSavedTime.toLocaleTimeString('ro-RO', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <CloudOff size={14} className="text-red-400 shrink-0" />
              <span className="text-red-400">Eroare la salvarea automată</span>
            </>
          )}
          {saveStatus === 'idle' && articleId && (
            <>
              <Cloud size={14} className="text-slate-600 shrink-0" />
              <span>Modificările se salvează automat</span>
            </>
          )}
        </p>

        <button
          type="submit"
          disabled={isSubmitting || isUploading || saveStatus === 'saving'}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {(isSubmitting || isUploading) && <Loader2 size={18} className="animate-spin" />}
          {isUploading
            ? 'Se încarcă imaginea...'
            : isSubmitting
              ? 'Se salvează...'
              : submitLabel}
        </button>
      </div>
    </form>
  );
}
