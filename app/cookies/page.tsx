'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Cookie } from 'lucide-react';

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
                <Cookie className="text-yellow-500" /> Politica de Cookies
            </h1>
            <p className="text-gray-400">Cum folosim tehnologia pentru o experiență mai bună.</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <h3>1. Ce sunt cookie-urile?</h3>
            <p>Un cookie este un fișier mic de text care este stocat pe dispozitivul dumneavoastră atunci când vizitați un site web. Acestea ajută site-ul să funcționeze corect și să rețină preferințele utilizatorilor.</p>

            <h3>2. Ce cookie-uri folosim?</h3>
            <p>Utilizăm doar cookie-uri esențiale și de analiză:</p>
            <ul>
                <li><strong>Strict Necesare:</strong> Pentru funcționarea corectă a site-ului (ex: navigare, încărcare rapidă).</li>
                <li><strong>Analitice:</strong> Folosim servicii precum Google Analytics pentru a înțelege cum interacționează vizitatorii cu site-ul (număr de vizite, pagini populare). Aceste date sunt anonimizate.</li>
            </ul>

            <h3>3. Cum puteți controla cookie-urile?</h3>
            <p>Puteți controla și/sau șterge cookie-urile după cum doriți direct din setările browserului dumneavoastră (Chrome, Safari, Firefox). Rețineți că dezactivarea cookie-urilor poate afecta funcționalitatea anumitor părți ale site-ului.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}