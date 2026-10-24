import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, Clock } from 'lucide-react';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactează echipa Știrile Crypto pentru suport, parteneriate sau sesiuni de consultanță.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Contactează-ne
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ai o întrebare despre academie, o propunere de parteneriat sau vrei să semnalezi o știre? Suntem aici.
          </p>
        </div>

        <div className="max-w-xl">
          <div className="bg-[#0b1221] p-8 rounded-2xl border border-white/5 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail className="text-blue-500" /> Email
              </h3>
              <p className="text-gray-400 mb-2">Pentru suport, întrebări și parteneriate:</p>
              <a href="mailto:consultantacrypto.ro@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium break-all">
                consultantacrypto.ro@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="text-green-500" /> Consultanță
              </h3>
              <p className="text-gray-400 mb-2">Programează o sesiune de strategie:</p>
              <a href="mailto:consultantacrypto.ro@gmail.com" className="text-green-400 hover:text-green-300 transition-colors font-medium break-all">
                consultantacrypto.ro@gmail.com
              </a>
              <a
                href="https://www.mihaidaniel.ro/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-slate-400 underline decoration-white/20 underline-offset-2 hover:text-white"
              >
                mihaidaniel.ro
              </a>
            </div>

            <div>
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-orange-500" /> Program
              </h3>
              <p className="text-gray-400">
                Luni - Vineri: 09:00 - 18:00<br />
                Weekend: Doar urgențe majore de piață
              </p>
            </div>

            <a
              href="mailto:consultantacrypto.ro@gmail.com"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Scrie-ne pe email
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}