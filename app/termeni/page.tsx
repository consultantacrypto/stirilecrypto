'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, ShieldAlert } from 'lucide-react';

export default function Termeni() {
  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
                <FileText className="text-blue-500" /> Termeni și Condiții
            </h1>
            <p className="text-gray-400">Ultima actualizare: 22 Decembrie 2024</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl mb-8">
                <h3 className="text-red-400 font-bold flex items-center gap-2 mt-0">
                    <ShieldAlert size={20}/> DISCLAIMER IMPORTANT
                </h3>
                <p className="mb-0 text-sm">
                    Acest site are un scop exclusiv educativ. <strong>Mihai Daniel NU oferă consultanță financiară autorizată.</strong> 
                    Piața criptomonedelor este volatilă și implică riscuri majore. Nu investiți bani pe care nu vă permiteți să-i pierdeți.
                </p>
            </div>

            <h3>1. Acceptarea Termenilor</h3>
            <p>Prin accesarea și utilizarea site-ului mihaidaniel.ro, acceptați acești termeni și condiții în totalitate. Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu utilizați acest site.</p>

            <h3>2. Natura Informațiilor</h3>
            <p>Toate articolele, analizele, datele din Terminalul Market și materialele video reprezintă opiniile personale ale autorului sau date agregate de la terți. Ele nu constituie o ofertă de vânzare sau o solicitare de a cumpăra orice instrument financiar.</p>

            <h3>3. Drepturi de Proprietate Intelectuală</h3>
            <p>Conținutul acestui site (texte, logo-uri, elemente de design, structura "MD Terminal") este protejat de legea drepturilor de autor. Este interzisă reproducerea integrală sau parțială fără acordul scris al proprietarului.</p>

            <h3>4. Limitarea Răspunderii</h3>
            <p>Echipa Mihai Daniel nu va fi răspunzătoare pentru nicio pierdere financiară sau daune directe/indirecte rezultate din utilizarea informațiilor prezente pe acest site. Utilizatorul își asumă întreaga responsabilitate pentru propriile decizii de investiții.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}