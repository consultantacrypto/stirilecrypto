import Link from 'next/link';

export default function HeroNewsPortal() {
  return (
    <section
      aria-label="Știrile Crypto — portal de știri și date on-chain"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black px-4 sm:px-6 pt-16 pb-24 lg:pt-20 lg:pb-32"
    >
      <style>{`
        @keyframes hero-news-aurora {
          0%, 100% { opacity: 0.45; transform: translate(-10%, -5%) scale(1); }
          50% { opacity: 0.7; transform: translate(8%, 6%) scale(1.08); }
        }
        .hero-news-aurora {
          animation: hero-news-aurora 18s ease-in-out infinite;
        }
      `}</style>

      {/* Slow radial aurora */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hero-news-aurora"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56, 189, 248, 0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Grid lines fading into news section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/90 to-transparent"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center gap-6 md:gap-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-green-300 shadow-[0_0_24px_rgba(34,197,94,0.25)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          🟢 Live: Analiză On-Chain &amp; Știri
        </span>

        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-slate-500">
          Știrile Crypto
        </p>

        <h1
          className="font-[family-name:var(--font-space),sans-serif] text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-7xl font-bold tracking-tight text-white leading-[1.05] max-w-4xl"
        >
          Zgomotul e gratuit.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-slate-400">
            Semnalul costă.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl">
          Platforma premium pentru investitorii care refuză să fie lichiditate pentru alții.
          Ultimele știri și date instituționale, decodate.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mt-2">
          <a
            href="#news-feed"
            className="inline-flex items-center justify-center bg-white text-black font-bold px-8 py-4 rounded-xl text-sm sm:text-base shadow-[0_0_32px_rgba(56,189,248,0.35)] hover:bg-sky-50 hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Explorează Știrile
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-white/20 bg-white/5 text-white font-semibold px-8 py-4 rounded-xl text-sm sm:text-base backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Mentorat Privat 1-la-1
          </Link>
        </div>
      </div>
    </section>
  );
}
