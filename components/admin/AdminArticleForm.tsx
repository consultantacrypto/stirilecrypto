'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle2, AlertCircle, Loader2, ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import GoogleSeoPreview from '@/components/admin/GoogleSeoPreview';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';
import { createClient } from '@/lib/supabase/client';
import { slugify, sanitizeFileName } from '@/lib/slugify';
import type { ArticleStatus, Stire } from '@/lib/types/stiri';

const STORAGE_BUCKET = 'imagini-stiri';

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
    status: article.status,
    image_url: article.image_url ?? '',
    meta_title: article.meta_title ?? '',
    meta_description: article.meta_description ?? '',
  };
}

export type AdminArticleFormProps = {
  initialData?: Stire;
};

export default function AdminArticleForm({ initialData }: AdminArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [form, setForm] = useState<FormState>(() =>
    initialData ? formFromArticle(initialData) : emptyForm
  );
  const [slugTouched, setSlugTouched] = useState(isEditing);
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = useMemo(() => {
    const base = [...CATEGORIES];
    if (form.category && !base.includes(form.category as (typeof CATEGORIES)[number])) {
      return [form.category, ...base];
    }
    return base;
  }, [form.category]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(null);
  };

  const selectCoverFromLibrary = (url: string) => {
    updateField('image_url', url);
    setCoverPreview(url);
    setCoverFile(null);
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

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Fișierul trebuie să fie o imagine (JPG, PNG, WebP).');
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setError(null);
    setSuccess(null);
  }, []);

  const uploadCover = async (file: File): Promise<string> => {
    const supabase = createClient();
    const uniqueName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(uniqueName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      throw new Error(`Upload eșuat: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(uniqueName);
    return data.publicUrl;
  };

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
    if (!form.image_url && !coverFile) return 'Încarcă o imagine de copertă.';
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
      let imageUrl = form.image_url;

      if (coverFile) {
        setIsUploading(true);
        imageUrl = await uploadCover(coverFile);
        setIsUploading(false);
      }

      const publishedAt =
        form.status === 'published'
          ? initialData?.published_at ?? new Date().toISOString()
          : null;

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category,
        status: form.status,
        image_url: imageUrl,
        published_at: publishedAt,
        meta_title: form.meta_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
      };

      const supabase = createClient();

      if (initialData) {
        const { error: updateError } = await supabase
          .from('stiri')
          .update(payload)
          .eq('id', initialData.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        setSuccess(
          form.status === 'published'
            ? 'Articol actualizat și publicat!'
            : 'Draft actualizat cu succes!'
        );
        router.refresh();
      } else {
        const { error: insertError } = await supabase.from('stiri').insert(payload);

        if (insertError) {
          throw new Error(insertError.message);
        }

        setSuccess(
          form.status === 'published'
            ? 'Articol publicat cu succes!'
            : 'Draft salvat cu succes!'
        );
        setForm(emptyForm);
        setSlugTouched(false);
        setCoverFile(null);
        setCoverPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
                  src={coverPreview || form.image_url}
                  alt="Previzualizare copertă"
                  className="h-full w-full object-cover"
                />
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

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {(isSubmitting || isUploading) && <Loader2 size={18} className="animate-spin" />}
        {isUploading
          ? 'Se încarcă imaginea...'
          : isSubmitting
            ? 'Se salvează...'
            : submitLabel}
      </button>
    </form>
  );
}
