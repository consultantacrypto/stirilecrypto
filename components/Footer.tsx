'use client';

import Link from 'next/link';
import { Mail, ShieldCheck, Globe, Clock } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { NEWSLETTER_WAITLIST_VISIBLE } from '@/lib/newsletter';
import { SOCIAL_LINKS } from '@/lib/social';
import MorningNewsletter from '@/components/MorningNewsletter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8 font-[var(--font-inter)] mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">
                SC
              </div>
              <span className="text-xl font-black text-white font-[var(--font-space)]">
                Știrile Crypto
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Știri crypto, analiză on-chain și intelligence de piață. Transformăm complexitatea
              pieței în context clar pentru investitori.
            </p>
            <MorningNewsletter id="newsletter-footer" location="footer" variant="compact" />
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 underline decoration-white/20 underline-offset-4 hover:text-white"
                    onClick={() => trackEvent('social_share', { platform: link.shortLabel, location: 'footer' })}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://www.linkedin.com/in/mihaidanielmarius/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 underline decoration-white/20 underline-offset-4 hover:text-white"
                >
                  LinkedIn, Daniel Mihai
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Globe size={18} className="text-blue-500" /> Platformă
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/incepe-aici" className="hover:text-blue-400 transition-colors">
                  Începe aici
                </Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-blue-400 transition-colors">
                  Piața azi
                </Link>
              </li>
              <li>
                <Link href="/stiri" className="hover:text-blue-400 transition-colors">
                  Știri care îți ating banii
                </Link>
              </li>
              <li>
                <Link href="/academie" className="hover:text-blue-400 transition-colors">
                  Academia Crypto
                </Link>
              </li>
              <li>
                <Link href="/glosar" className="hover:text-blue-400 transition-colors">
                  Glosar
                </Link>
              </li>
              <li>
                <Link href="/lichidari" className="hover:text-blue-400 transition-colors">
                  Harta pieței
                </Link>
              </li>
              <li>
                <Link href="/taxe" className="hover:text-blue-400 transition-colors">
                  Taxe crypto 2026
                </Link>
              </li>
              <li>
                <Link href="/raport-strategic" className="hover:text-blue-400 transition-colors">
                  Ce cumpără balenele
                </Link>
              </li>
              {NEWSLETTER_WAITLIST_VISIBLE ? (
                <li>
                  <Link href="/#newsletter" className="hover:text-blue-400 transition-colors">
                    Lista de așteptare
                  </Link>
                </li>
              ) : null}
              <li>
                <Link href="/analiza-tehnica?src=footer" className="hover:text-blue-400 transition-colors">
                  Analiză tehnică, de la 79 lei
                </Link>
              </li>
              <li>
                <Link href="/verificare-portofel?src=footer" className="hover:text-blue-400 transition-colors">
                  Verificare portofel crypto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-500" /> Editorial
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link
                  href="/despre"
                  className="hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  Despre Noi{' '}
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                    Info
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400 transition-colors">
                  Contact & Suport
                </Link>
              </li>
              <li>
                <Link href="/autori/daniel-mihai" className="hover:text-green-400 transition-colors">
                  Daniel Mihai, analist
                </Link>
              </li>
              <li>
                <a
                  href="https://www.mihaidaniel.ro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  Consultanță
                </a>
              </li>
              <li>
                <Link href="/termeni" className="hover:text-green-400 transition-colors">
                  Termeni & Condiții
                </Link>
              </li>
              <li>
                <Link href="/confidentialitate" className="hover:text-green-400 transition-colors">
                  Confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-green-400 transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Mail size={18} className="text-purple-500" /> Contact
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Mail className="text-gray-600 shrink-0" size={16} />
                <a
                  href="mailto:contact@stirilecrypto.ro"
                  className="hover:text-white transition-colors"
                >
                  contact@stirilecrypto.ro
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="text-gray-600 shrink-0" size={16} />
                <span>Luni – Vineri, 09:00 – 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <p className="text-xs text-gray-600">
            © {currentYear} Știrile Crypto. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}
