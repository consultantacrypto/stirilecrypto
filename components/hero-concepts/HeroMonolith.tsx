const CONSULT_URL = 'https://mihaidaniel.ro';

export default function HeroMonolith() {
  return (
    <section
      aria-label="Hero — cyber Web3"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black px-4 sm:px-6 py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.5)] animate-pulse" />
        <div
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-blue-500/30 animate-spin"
          style={{ animationDuration: '24s' }}
        />
        <div
          className="absolute w-[min(90vw,520px)] h-[min(90vw,520px)] rounded-full border border-dashed border-blue-400/20 animate-spin"
          style={{ animationDuration: '40s', animationDirection: 'reverse' }}
        />
        <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-600/40 to-violet-600/20 blur-sm shadow-[0_0_80px_rgba(99,102,241,0.6)]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center flex flex-col items-center gap-8 md:gap-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-7xl font-bold tracking-tight text-white leading-[1.05]">
          Piața nu iartă ezitarea.
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed">
          Structură. Execuție. Mentorat 1-on-1 aplicat pe capitalul tău — fără imagini grele,
          fără compromisuri de performanță.
        </p>
        <div className="w-full max-w-md border border-blue-500/30 bg-blue-950/20 rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-lg sm:text-xl font-semibold text-white mb-6">
            Portofoliul tău nu are nevoie de noroc. Are nevoie de o strategie.
          </p>
          <a
            href={CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center bg-blue-500 text-white font-bold py-4 rounded-xl text-sm sm:text-base shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:bg-blue-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Rezervă mentorat privat →
          </a>
        </div>
      </div>
    </section>
  );
}
