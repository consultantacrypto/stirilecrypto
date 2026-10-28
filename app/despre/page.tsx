import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Award, ShieldCheck, Users } from 'lucide-react';
import {
  EDITORIAL_POLICY_LINKS,
  OPERATOR_LEGAL_NAME,
  OPERATOR_REGISTERED_OFFICE_LINE,
  SITE_URL,
} from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Despre Noi',
  description:
    'Cine publică Știrile Crypto: redactorul Daniel Mihai și operatorul QuickExit, LLC. Principii editoriale și date de contact. CUI-ul operatorului nu este publicat încă.',
  alternates: {
    canonical: `${SITE_URL}/despre`,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
        
        <div className="mb-20 max-w-3xl">
            <div>
                <div className="inline-block bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 border border-blue-500/20">
                    Despre Noi
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                    Nu suntem aici să ghicim prețul. <br/>
                    <span className="text-blue-500">Suntem aici să înțelegem jocul.</span>
                </h1>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                    <strong>Știrile Crypto</strong> a luat naștere din frustrarea investitorilor față de zgomotul din piața crypto și lipsa contextului real.
                </p>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Într-o lume plină de headline-uri fără substanță, misiunea noastră este clară: <strong>știri filtrate, analiză on-chain și educație financiară aplicată.</strong> Nu promitem îmbogățire peste noapte — oferim claritate.
                </p>
                
                <div className="rounded-2xl border border-white/10 bg-[#0b1221] p-6 text-sm leading-relaxed text-gray-300">
                    <h2 className="text-lg font-bold text-white mb-3">Cine publică</h2>
                    <p className="mb-3">
                        <strong className="text-white">Știrile Crypto</strong> este o publicație în limba română despre știri crypto, analiză de piață și educație financiară. Site-ul este stirilecrypto.ro. Operatorul juridic este {OPERATOR_LEGAL_NAME}.
                    </p>
                    <p className="mb-3">
                        Redactorul publicației este{' '}
                        <Link href="/autori/daniel-mihai" className="text-blue-400 underline hover:text-blue-300">
                            Daniel Mihai
                        </Link>
                        . Știrile și analizele de piață sunt semnate de el, de{' '}
                        <Link href="/autori/cristian-vasile" className="text-blue-400 underline hover:text-blue-300">
                            Cristian Vasile
                        </Link>{' '}
                        și de{' '}
                        <Link href="/autori/emilian-constantin" className="text-blue-400 underline hover:text-blue-300">
                            Emilian Constantin
                        </Link>
                        .
                    </p>
                    <p>
                        Email editorial:{' '}
                        <a href="mailto:contact@stirilecrypto.ro" className="text-blue-400 underline hover:text-blue-300">
                            contact@stirilecrypto.ro
                        </a>
                        . Programul afișat la{' '}
                        <Link href="/contact" className="text-blue-400 underline hover:text-blue-300">
                            Contact
                        </Link>
                        {' '}este luni–vineri, 09:00–18:00. Consultanța 1-la-1 este separată de publicație, pe mihaidaniel.ro.
                    </p>
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
                    Nu acceptăm plăți pentru a promova proiecte „pump & dump”. Analizele noastre se bazează pe date on-chain, macroeconomie și realități legislative, nu pe hype plătit.
                </p>
            </div>

            <div className="bg-[#0b1221] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <Award className="text-purple-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Educație, nu Ponturi</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Nu spunem „cumpără asta acum”. Explicăm mecanismele din spate, ca să poți lua singur decizia. Scopul este înțelegerea pieței, nu un pont.
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

        <div className="bg-[#0b1221]/50 p-8 rounded-2xl border border-white/5 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Politici</h2>
            <ul className="space-y-2 text-sm">
                {EDITORIAL_POLICY_LINKS.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-blue-400 underline hover:text-blue-300">
                            {link.label}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link href="/redactie" className="text-blue-400 underline hover:text-blue-300">
                        Redacție
                    </Link>
                </li>
            </ul>
        </div>

        <div className="bg-[#0b1221]/50 p-8 rounded-2xl border border-white/5 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Politică editorială și disclaimer</h2>
            <div className="space-y-4 text-sm text-gray-500">
                <p>
                    <strong>Disclaimer financiar:</strong> Conținutul de pe acest site este în scop educațional și informativ. Știrile Crypto nu oferă consultanță financiară autorizată. Investițiile în criptomonede implică riscuri majore, inclusiv pierderea capitalului.
                </p>
                <p>
                    <strong>Afiliere:</strong> Unele linkuri pot fi de afiliere. Dacă te înregistrezi prin ele, platforma poate primi un comision, fără cost suplimentar pentru tine. Casetele sunt marcate „Link afiliat”. Detaliile sunt în pagina{' '}
                    <Link href="/publicitate" className="text-gray-300 underline">
                        Publicitate și afiliere
                    </Link>
                    .
                </p>
            </div>
        </div>

        <section id="date-operator" className="scroll-mt-28 rounded-2xl border border-white/10 bg-[#0b1221] p-8">
            <h2 className="text-lg font-bold text-white mb-3">Date operator</h2>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Publicația este operată de {OPERATOR_LEGAL_NAME}. Sediul social înregistrat este în Delaware, Statele Unite. Codul fiscal (CUI / EIN) nu este publicat încă.
            </p>
            <dl className="space-y-3 text-sm">
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                    <dt className="text-gray-400">Denumire</dt>
                    <dd className="text-white">{OPERATOR_LEGAL_NAME}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                    <dt className="text-gray-400">CUI</dt>
                    <dd className="text-amber-200">de completat</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                    <dt className="text-gray-400">Sediu</dt>
                    <dd className="text-white">{OPERATOR_REGISTERED_OFFICE_LINE}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                    <dt className="text-gray-400">Redactor-șef</dt>
                    <dd className="text-white">
                        <Link href="/autori/daniel-mihai" className="underline decoration-white/30 underline-offset-2">
                            Daniel Mihai
                        </Link>
                    </dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                    <dt className="text-gray-400">Email editorial</dt>
                    <dd>
                        <a href="mailto:contact@stirilecrypto.ro" className="text-white underline decoration-white/30 underline-offset-2">
                            contact@stirilecrypto.ro
                        </a>
                    </dd>
                </div>
            </dl>
        </section>

      </main>
      <Footer />
    </div>
  );
}