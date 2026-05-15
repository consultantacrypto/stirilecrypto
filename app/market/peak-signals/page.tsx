import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AffiliateSection from '@/components/AffiliateSection';
// ✅ IMPORTĂM CONTAINERUL (care e Client Component), NU graficul direct
import PeakSignalsContainer from '@/components/PeakSignalsContainer';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Bitcoin Peak Signals | Analiză On-Chain Mihai Daniel',
  description: 'Grafice avansate pentru detectarea vârfurilor de ciclu Bitcoin. 2-Year MA Multiplier.',
};

export default function PeakSignalsPage() {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* NAVIGARE ÎNAPOI */}
        <div className="mb-8">
            <Link href="/market" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> 
                Înapoi la Market Dashboard
            </Link>
        </div>

        {/* HEADER */}
        <div className="text-center mb-12 relative">
            <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 mb-6">
                <BrainCircuit size={14}/> Algoritm On-Chain v1.0
            </span>
            
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                VÂRFURI DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">CICLU</span>
            </h1>
            
            <p className="text-gray-400 max-w-2xl mx-auto">
                Identificăm matematic supraîncălzirea pieței folosind <strong className="text-white">2-Year MA Multiplier</strong>.
            </p>
        </div>

        {/* ✅ AICI VINE COMPONENTA SAFE (Client Side) */}
        <div className="mb-16">
            <PeakSignalsContainer />
        </div>

        {/* SECȚIUNE EDUCATIVĂ */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#0b1221] p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-3">🛠️ Cum funcționează?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Indicatorul calculează media prețului Bitcoin pe ultimii 2 ani (Linia Verde). Istoric, când prețul a crescut de 5 ori peste această medie (Linia Roșie), a semnalat vârful ciclului.
                </p>
            </div>
            <div className="bg-[#0b1221] p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-3">🎯 Strategie</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2"><span className="text-red-400 font-bold">Linia Roșie:</span> Zonă de Vânzare (DCA Out).</li>
                    <li className="flex gap-2"><span className="text-green-400 font-bold">Linia Verde:</span> Zonă de Acumulare (Buy).</li>
                </ul>
            </div>
        </div>

        <AffiliateSection />

      </main>
      <Footer />
    </div>
  );
}