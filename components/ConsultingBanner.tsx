import Image from 'next/image';

const CONSULT_URL = 'https://www.mihaidaniel.ro/';

export default function ConsultingBanner() {
  return (
    <aside
      aria-label="Mentorat privat 1-la-1"
      className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-12 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/15 blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-amber-500/10 blur-[70px]"
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="col-span-1 md:col-span-7">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            60 de minute intense.
          </h2>
          <p className="mt-5 text-slate-400 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {`Îți audităm portofoliul ca un profesionist, corectăm erorile care îți erodează profitul și setăm strategia de ieșire care maximizează câștigul.

Nu vorbim despre ce „ar putea” să se întâmple. Vorbim despre banii tăi și cum îi facem să lucreze mai inteligent.`}
          </p>

          <div className="bg-white/5 border border-amber-500/30 p-5 rounded-xl mt-6">
            <p className="text-amber-200/90 font-bold text-sm sm:text-base mb-3">
              🎁 BONUS EXCLUSIV GRATUIT ($200)
            </p>
            <ul className="text-slate-300 text-sm space-y-2 leading-relaxed">
              <li>• PACHET AI INVESTOR</li>
              <li>
                • „Audit ca un VC” – Prompt-urile secrete de analiză folosite de investitorii
                instituționali
              </li>
              <li>• „AI în Investiții” – Ghid practic de 20 pagini</li>
            </ul>
          </div>
        </div>

        <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center gap-6">
          <Image
            src="/mihai-daniel-consultanta.jpg"
            alt="Mihai Daniel — consultanță crypto 1-la-1"
            width={300}
            height={300}
            className="object-contain drop-shadow-2xl"
          />
          <a
            href={CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm text-center bg-white text-black font-bold text-base sm:text-lg px-8 py-4 rounded-xl shadow-[0_0_40px_rgba(56,189,248,0.25)] hover:bg-sky-50 hover:shadow-[0_0_48px_rgba(56,189,248,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Rezervă Sesiunea 1-la-1
          </a>
        </div>
      </div>
    </aside>
  );
}
