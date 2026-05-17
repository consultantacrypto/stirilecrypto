export default function HeroNewsPortal() {
  return (
    <section
      aria-label="Știrile Crypto — portal de știri și date on-chain"
      className="relative overflow-hidden bg-black px-4 sm:px-6 py-8 lg:py-10 border-b border-white/5"
    >
      <style>{`
        @keyframes hero-news-aurora {
          0%, 100% { opacity: 0.4; transform: translate(-8%, -4%) scale(1); }
          50% { opacity: 0.65; transform: translate(6%, 4%) scale(1.06); }
        }
        .hero-news-aurora {
          animation: hero-news-aurora 18s ease-in-out infinite;
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hero-news-aurora"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 75% 35%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)',
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_85%)]"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center gap-4 md:gap-5">
        <div className="flex items-center gap-4 w-full max-w-md" aria-hidden>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.4)]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-sky-400/80 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.4)]" />
        </div>

        <h1 className="font-[family-name:var(--font-space),sans-serif] text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-7xl font-bold tracking-tight text-white leading-[1.08]">
          Zgomotul e gratuit.
          <br />
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Semnalul costă.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
          Știrile crypto pentru investitorii care refuză să fie lichiditate pentru alții. Ultimele
          evenimente și date instituționale, decodate.
        </p>
      </div>
    </section>
  );
}
