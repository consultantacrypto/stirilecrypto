'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck } from 'lucide-react';

export default function Confidentialitate() {
  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl font-black mb-4 flex items-center gap-3">
                <ShieldCheck className="text-green-500" /> Politica de Confidențialitate
            </h1>
            <p className="text-gray-400">Ne pasă de datele tale.</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <h3>1. Ce date colectăm?</h3>
            <p>Respectăm intimitatea utilizatorilor noștri. În prezent, nu colectăm date personale (nume, adresă, telefon) decât dacă ni le oferiți voluntar (de exemplu, prin înscrierea la Newsletter sau completarea formularului de contact).</p>

            <h3>2. Cum folosim datele?</h3>
            <p>Datele colectate sunt folosite exclusiv pentru:</p>
            <ul>
                <li>Comunicarea cu dumneavoastră (răspuns la email-uri).</li>
                <li>Trimiterea de materiale educaționale (dacă v-ați abonat).</li>
                <li>Îmbunătățirea experienței pe site.</li>
            </ul>

            <h3>3. Protecția Datelor</h3>
            <p>Nu vindem, nu închiriem și nu oferim datele dumneavoastră către terți. Luăm măsuri de securitate rezonabile pentru a proteja informațiile împotriva accesului neautorizat.</p>

            <h3>4. Drepturile Dumneavoastră</h3>
            <p>Conform GDPR, aveți dreptul de a solicita accesul, rectificarea sau ștergerea datelor dumneavoastră personale. Pentru orice solicitare, ne puteți contacta la adresa de email din footer.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}