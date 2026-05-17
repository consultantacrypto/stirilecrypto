export default function HeroNewsPortal() {
  return (
    <section
      aria-label="Știrile Crypto — portal de știri și date on-chain"
      className="relative overflow-hidden bg-black px-4 sm:px-6 py-8 lg:py-10"
    >
      <style>{`
        @keyframes hero-liquid-drift-a {
          0%, 100% { transform: translate(-50%, -20%) scale(1); opacity: 0.55; }
          50% { transform: translate(-42%, -8%) scale(1.12); opacity: 0.85; }
        }
        @keyframes hero-liquid-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(12%, -10%) scale(1.08); opacity: 0.7; }
        }
        .hero-liquid-orb-a {
          animation: hero-liquid-drift-a 14s ease-in-out infinite;
        }
        .hero-liquid-orb-b {
          animation: hero-liquid-drift-b 18s ease-in-out infinite;
        }
      `}</style>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-black"
      >
        <div className="hero-liquid-orb-a absolute top-0 left-1/2 w-[min(90vw,520px)] h-[min(90vw,520px)] bg-blue-900/30 rounded-full blur-[120px]" />
        <div className="hero-liquid-orb-b absolute top-1/4 -left-24 w-[min(70vw,420px)] h-[min(70vw,420px)] bg-indigo-600/25 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[min(60vw,380px)] h-[min(60vw,380px)] bg-violet-900/20 rounded-full blur-[110px] animate-pulse [animation-duration:12s]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

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
