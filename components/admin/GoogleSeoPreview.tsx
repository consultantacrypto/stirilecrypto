type GoogleSeoPreviewProps = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  excerpt: string;
};

export default function GoogleSeoPreview({
  slug,
  metaTitle,
  metaDescription,
  title,
  excerpt,
}: GoogleSeoPreviewProps) {
  const previewSlug = slug.trim() || 'slug-articol';
  const previewTitle = (metaTitle.trim() || title.trim() || 'Titlul articolului').slice(0, 70);
  const previewDescription = (
    metaDescription.trim() ||
    excerpt.trim() ||
    'Descrierea articolului va apărea aici în rezultatele Google.'
  ).slice(0, 160);

  return (
    <div
      className="rounded-xl border border-white/10 bg-[#f8f9fa] p-4 md:p-5 shadow-inner"
      aria-label="Previzualizare Google"
    >
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
        Previzualizare Google
      </p>
      <p className="text-sm leading-snug mb-1 truncate font-[var(--font-inter)]">
        <span className="text-[#202124]">stirilecrypto.ro</span>
        <span className="text-[#5f6368]"> › stiri › </span>
        <span className="text-[#006621]">{previewSlug}</span>
      </p>
      <p className="text-xl text-[#1a0dab] leading-tight font-normal mb-1 line-clamp-2 font-[var(--font-inter)]">
        {previewTitle}
      </p>
      <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-2 font-[var(--font-inter)]">
        {previewDescription}
      </p>
    </div>
  );
}
