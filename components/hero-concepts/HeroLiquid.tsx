const CONSULT_URL = 'https://mihaidaniel.ro';

export default function HeroLiquid() {
  return (
    <section
      aria-label="Hero — informație instituțională"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black px-4 sm:px-6 py-20 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(90vw,720px)] h-[min(70vw,520px)] bg-blue-900/20 blur-[120px] rounded-full animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[min(60vw,480px)] h-[min(50vw,400px)] bg-indigo-600/10 blur-[100px] rounded-full animate-pulse [animation-delay:1.5s]"
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-8 md:gap-12">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-blue-400/90">
          StirileCrypto.ro
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-7xl font-bold tracking-tight text-white leading-[1.05]">
          Informație Instituțională.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
            Decizii de Top.
          </span>
        </h1>

        <div className="w-full max-w-xl backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-950/20">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block mb-4">
            Mentorat privat 1-on-1
          </span>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-snug mb-6">
            Portofoliul tău nu are nevoie de noroc. Are nevoie de o strategie.
          </p>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
            Oprește pierderile provocate de zgomotul din social media. Navighează piața crypto
            alături de un mentor cu experiență reală, prin sesiuni private, aplicate 100% pe
            capitalul tău.
          </p>
          <a
            href={CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center bg-white text-black font-bold px-8 py-4 rounded-xl text-sm sm:text-base transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Rezervă o sesiune privată →
          </a>
        </div>
      </div>
    </section>
  );
}
