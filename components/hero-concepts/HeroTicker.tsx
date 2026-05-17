const CONSULT_URL = 'https://mihaidaniel.ro';

const MARQUEE_TEXT =
  'ACCUMULATION • MARKUP • DISTRIBUTION • MARKDOWN • ACCUMULATION • MARKUP • DISTRIBUTION • MARKDOWN • ';

export default function HeroTicker() {
  return (
    <section
      aria-label="Hero — terminal Wall Street"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black px-4 sm:px-6 py-20"
    >
      <style>{`
        @keyframes hero-ticker-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-ticker-track {
          animation: hero-ticker-marquee 55s linear infinite;
        }
      `}</style>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 flex items-center overflow-hidden pointer-events-none select-none"
      >
        <div className="hero-ticker-track flex whitespace-nowrap opacity-5 text-6xl sm:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white">
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center flex flex-col items-center gap-8 md:gap-10">
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-green-500/80">
          Terminal / Mentorship
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-7xl font-bold tracking-tight text-white leading-[1.05]">
          Capital inteligent.
          <br />
          <span className="text-slate-500">Nu reacții emoționale.</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
          Mentorat privat 1-on-1 pentru investitori care vor structură, nu zgomot. Sesiuni
          aplicate pe portofoliul tău real.
        </p>
        <div className="w-full max-w-md border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-lg sm:text-xl font-bold text-white mb-6">
            Portofoliul tău nu are nevoie de noroc. Are nevoie de o strategie.
          </p>
          <a
            href={CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-500 text-black font-bold py-4 rounded-sm text-sm sm:text-base uppercase tracking-wider hover:bg-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          >
            Rezervă mentorat 1-on-1 →
          </a>
        </div>
      </div>
    </section>
  );
}
