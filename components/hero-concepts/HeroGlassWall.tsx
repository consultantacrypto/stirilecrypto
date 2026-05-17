import Link from 'next/link';

const CONSULT_URL = 'https://mihaidaniel.ro';

export default function HeroGlassWall() {
  return (
    <section
      aria-label="Hero — hedge fund office"
      className="relative min-h-[80vh] flex items-center bg-black px-4 sm:px-6 py-16 lg:py-24"
    >
      <div className="container mx-auto max-w-7xl w-full">
        <div className="mb-10 md:mb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.05]">
            Biroul tău de analiză.
            <span className="text-slate-500"> Fără imagini. Fără lag.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 auto-rows-fr">
          <article className="md:col-span-7 md:row-span-2 min-h-[280px] flex flex-col justify-between bg-gradient-to-b from-white/10 to-transparent border-t border-white/20 rounded-sm p-8 sm:p-10 lg:p-12 backdrop-blur-sm">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                Mentorat privat 1-on-1
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug max-w-lg">
                Portofoliul tău nu are nevoie de noroc. Are nevoie de o strategie.
              </h2>
              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed max-w-md">
                Navighează piața crypto alături de un mentor cu experiență reală — sesiuni private,
                100% pe capitalul tău.
              </p>
            </div>
            <a
              href={CONSULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full sm:w-auto items-center justify-center bg-white text-black font-bold px-8 py-4 text-sm sm:text-base hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Rezervă o sesiune privată →
            </a>
          </article>

          <Link
            href="/stiri"
            className="md:col-span-5 min-h-[160px] group flex flex-col justify-end bg-gradient-to-b from-white/10 to-transparent border-t border-white/20 rounded-sm p-6 sm:p-8 backdrop-blur-sm hover:from-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
              Editorial
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Ultimele Știri
            </h3>
            <p className="text-slate-500 text-sm mt-2">Analize și context de piață →</p>
          </Link>

          <Link
            href="/market"
            className="md:col-span-5 min-h-[160px] group flex flex-col justify-end bg-gradient-to-b from-white/10 to-transparent border-t border-white/20 rounded-sm p-6 sm:p-8 backdrop-blur-sm hover:from-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
              Live Data
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Date On-Chain
            </h3>
            <p className="text-slate-500 text-sm mt-2">Indicatori și semnale macro →</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
