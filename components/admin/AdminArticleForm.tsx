'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { slugify, sanitizeFileName } from '@/lib/slugify';
import type { ArticleStatus } from '@/lib/types/stiri';

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
};

const initialForm: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: CATEGORIES[0],
  status: 'draft',
  image_url: '',
};

export default function AdminArticleForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(null);
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
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase nu este configurat. Verifică variabilele de mediu.');
    }

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
    if (!form.content.trim()) return 'Conținutul este obligatoriu.';
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
        form.status === 'published' ? new Date().toISOString() : null;

      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase nu este configurat. Verifică variabilele de mediu.');
      }

      const { error: insertError } = await supabase.from('stiri').insert({
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category,
        status: form.status,
        image_url: imageUrl,
        published_at: publishedAt,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess(
        form.status === 'published'
          ? 'Articol publicat cu succes!'
          : 'Draft salvat cu succes!'
      );
      setForm(initialForm);
      setSlugTouched(false);
      setCoverFile(null);
      setCoverPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvare.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

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
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="slug-articol"
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
            {CATEGORIES.map((cat) => (
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
          <label htmlFor="content" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Conținut (HTML permis)
          </label>
          <textarea
            id="content"
            rows={14}
            value={form.content}
            onChange={(e) => updateField('content', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="<p>Conținutul articolului...</p>"
          />
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Imagine copertă
        </span>
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
            handleFile(file ?? null);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 cursor-pointer transition-colors ${
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
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          {coverPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverPreview}
              alt="Previzualizare copertă"
              className="max-h-48 rounded-lg object-contain"
            />
          ) : (
            <>
              <Upload className="text-slate-500" size={32} />
              <p className="text-slate-400 text-sm text-center">
                Trage imaginea aici sau click pentru a selecta
              </p>
              <p className="text-slate-600 text-xs">JPG, PNG, WebP — upload în bucket imagini-stiri</p>
            </>
          )}
        </div>
        {form.image_url && !coverPreview && (
          <p className="text-xs text-slate-500 truncate">URL curent: {form.image_url}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {(isSubmitting || isUploading) && <Loader2 size={18} className="animate-spin" />}
        {isUploading ? 'Se încarcă imaginea...' : isSubmitting ? 'Se salvează...' : 'Salvează articolul'}
      </button>
    </form>
  );
}
