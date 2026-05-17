const CONSULT_URL = 'https://mihaidaniel.ro';

export default function HeroHorology() {
  return (
    <section
      aria-label="Hero — precizie și semnal"
      className="relative min-h-[80vh] flex items-center bg-black px-4 sm:px-6 py-16 lg:py-24 bg-[radial-gradient(#1c1c1e_1px,transparent_1px)] [background-size:20px_20px]"
    >
      <div className="container mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-slate-500">
              CH — 01 / SIGNAL
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-7xl font-bold tracking-tight text-white leading-[1.02]">
              Fără Zgomot.
              <br />
              <span className="text-slate-400">Doar Semnal.</span>
            </h1>
            <p className="max-w-xl text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed font-mono">
              Analiză editorială și context macro pentru decizii calibrate — fără hype, fără
              predicții gratuite.
            </p>
            <div className="hidden lg:flex gap-8 font-mono text-[11px] text-slate-600 uppercase tracking-widest">
              <span>Latency &lt; 1 editorial cycle</span>
              <span>Bias: neutral</span>
            </div>
          </div>

          <aside className="lg:col-span-5 w-full">
            <div className="border border-slate-700 bg-[#0a0a0b] font-mono text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2 bg-[#111113]">
                <span className="text-[10px] uppercase tracking-widest text-amber-500/90">
                  MENTORAT 1-ON-1
                </span>
                <span className="text-[10px] text-green-500">● LIVE</span>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Widget / Private Advisory
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug normal-case tracking-tight">
                  Portofoliul tău nu are nevoie de noroc. Are nevoie de o strategie.
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed normal-case">
                  Sesiuni private aplicate 100% pe capitalul tău. Fără grupuri, fără semnale
                  rapide — doar structură și execuție.
                </p>
                <dl className="grid grid-cols-2 gap-3 text-[10px] sm:text-xs border-t border-slate-800 pt-4">
                  <div>
                    <dt className="text-slate-600 uppercase">Format</dt>
                    <dd className="text-white mt-1">1-on-1</dd>
                  </div>
                  <div>
                    <dt className="text-slate-600 uppercase">Focus</dt>
                    <dd className="text-white mt-1">Risk / Allocation</dd>
                  </div>
                </dl>
                <a
                  href={CONSULT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-amber-500/60 bg-amber-500/10 text-amber-100 font-bold py-3.5 text-xs sm:text-sm uppercase tracking-wider hover:bg-amber-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  Rezervă sesiune →
                </a>
              </div>
              <div className="border-t border-slate-800 px-4 py-2 text-[9px] text-slate-600 uppercase tracking-widest">
                Terminal v2.4 — Not financial advice
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
