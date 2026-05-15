import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { CheckCircle2, Award, ShieldCheck, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="w-full md:w-1/2">
                <div className="relative w-full aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    {/* ✅ IMAGINE ACTUALIZATĂ: mihai-daniel-consultanta.jpg */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-transparent to-transparent z-10"></div>
                    <img 
                        src="/mihai-daniel-consultanta.jpg" 
                        alt="Mihai Daniel" 
                        className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            </div>
            
            <div className="w-full md:w-1/2">
                <div className="inline-block bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 border border-blue-500/20">
                    Despre Noi
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                    Nu suntem aici să ghicim prețul. <br/>
                    <span className="text-blue-500">Suntem aici să înțelegem jocul.</span>
                </h1>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                    Salut, sunt <strong>Mihai Daniel</strong>. Platforma aceasta a luat naștere dintr-o frustrare personală: zgomotul asurzitor din piața crypto.
                </p>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Într-o lume plină de "experți" care îți promit îmbogățirea peste noapte, misiunea mea este diferită: <strong>Educație Financiară Brută & Analiză Instituțională.</strong> Nu vând vise, vând claritate.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0b1221] p-4 rounded-xl border border-white/5">
                        <div className="text-2xl font-black text-white mb-1">280K+</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Comunitate</div>
                    </div>
                    <div className="bg-[#0b1221] p-4 rounded-xl border border-white/5">
                        <div className="text-2xl font-black text-white mb-1">5 Ani+</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Experiență Piață</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-[#0b1221] p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <ShieldCheck className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Integritate Editorială</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Nu acceptăm plăți pentru a promova proiecte "pump & dump". Analizele noastre se bazează pe date on-chain, macroeconomie și realități legislative, nu pe hype plătit.
                </p>
            </div>

            <div className="bg-[#0b1221] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <Award className="text-purple-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Educație, nu Ponturi</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Nu îți voi spune "cumpără asta acum". Îți voi explica mecanismele din spate, ca să poți lua singur decizia corectă. Scopul este autonomia ta financiară.
                </p>
            </div>

            <div className="bg-[#0b1221] p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-colors group">
                <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                    <Users className="text-green-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Comunitate Reală</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Suntem o rețea de investitori care înțeleg că piețele se mișcă în cicluri. Ne pregătim în liniște când alții fac gălăgie și marcăm profitul când alții intră din FOMO.
                </p>
            </div>
        </div>

        {/* Disclaimer Legal & Affiliate (Obligatoriu Google News) */}
        <div className="bg-[#0b1221]/50 p-8 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Politică Editorială & Disclaimer</h3>
            <div className="space-y-4 text-sm text-gray-500">
                <p>
                    <strong>Disclaimer Financiar:</strong> Conținutul de pe acest site este strict în scop educațional și informativ. Mihai Daniel și echipa sa nu sunt consultanți financiari acreditați. Investițiile în criptomonede implică riscuri majore, inclusiv pierderea totală a capitalului. Fă-ți propriul research (DYOR) înainte de a investi.
                </p>
                <p>
                    <strong>Transparență Afiliere:</strong> Unele link-uri de pe acest site pot fi link-uri de afiliere. Asta înseamnă că, dacă te înregistrezi folosind aceste link-uri, platforma poate primi un mic comision, fără costuri suplimentare pentru tine. Acest lucru ne ajută să menținem conținutul gratuit și calitativ. Recomandăm doar platforme pe care le folosim personal (ex: Binance, Bybit, Ledger).
                </p>
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}