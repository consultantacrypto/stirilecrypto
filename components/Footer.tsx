'use client';

import Link from 'next/link';
import { Mail, ShieldCheck, Globe, Clock } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { NEWSLETTER_WAITLIST_VISIBLE } from '@/lib/newsletter';
import { PERSON_AUTHORS } from '@/lib/authors';
import { SITE_OPERATOR } from '@/lib/operator';
import { EDITORIAL_POLICY_LINKS } from '@/lib/json-ld';
import { SOCIAL_LINKS } from '@/lib/social';
import MorningNewsletter from '@/components/MorningNewsletter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#090a0d] pb-8 pt-16 font-[var(--font-inter)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
                SC
              </div>
              <span className="text-xl font-black text-white font-[var(--font-space)]">
                Știrile Crypto
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
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
                    className="text-sm text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-white"
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
                  className="text-sm text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-white"
                >
                  LinkedIn, Daniel Mihai
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Globe size={18} className="text-[var(--signal)]" /> Platformă
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link href="/incepe-aici" className="hover:text-white transition-colors">
                  Începe aici
                </Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-white transition-colors">
                  Piața azi
                </Link>
              </li>
              <li>
                <Link href="/stiri" className="hover:text-white transition-colors">
                  Știri care îți ating banii
                </Link>
              </li>
              <li>
                <Link href="/airdrop-alert" className="hover:text-white transition-colors">
                  Airdrop Alert
                </Link>
              </li>
              <li>
                <Link href="/academie" className="hover:text-white transition-colors">
                  Academia Crypto
                </Link>
              </li>
              <li>
                <Link href="/interviuri" className="hover:text-white transition-colors">
                  Interviuri
                </Link>
              </li>
              <li>
                <Link href="/glosar" className="hover:text-white transition-colors">
                  Glosar
                </Link>
              </li>
              <li>
                <Link href="/lichidari" className="hover:text-white transition-colors">
                  Harta pieței
                </Link>
              </li>
              <li>
                <Link href="/taxe" className="hover:text-white transition-colors">
                  Taxe crypto 2026
                </Link>
              </li>
              <li>
                <Link href="/raport-strategic" className="hover:text-white transition-colors">
                  Ce cumpără balenele
                </Link>
              </li>
              {NEWSLETTER_WAITLIST_VISIBLE ? (
                <li>
                  <Link href="/#newsletter" className="hover:text-white transition-colors">
                    Lista de așteptare
                  </Link>
                </li>
              ) : null}
              <li>
                <Link href="/analiza-tehnica?src=footer" className="hover:text-white transition-colors">
                  Analiză tehnică, de la 79 lei
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[var(--sand)]" /> Editorial
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link
                  href="/despre"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  Despre Noi{' '}
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300">
                    Info
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/intrebari-frecvente" className="hover:text-white transition-colors">
                  Întrebări frecvente
                </Link>
              </li>
              <li>
                <Link href="/hub/stiri-crypto-romania" className="hover:text-white transition-colors">
                  Știri crypto România
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Suport
                </Link>
              </li>
              <li>
                <Link href="/redactie" className="hover:text-white transition-colors">
                  Redacție
                </Link>
              </li>
              {PERSON_AUTHORS.map((author) => (
                <li key={author.path}>
                  <Link href={author.path} className="hover:text-white transition-colors">
                    {author.key === 'daniel-mihai' ? `${author.name}, redactor și analist` : author.name}
                  </Link>
                </li>
              ))}
              {EDITORIAL_POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.mihaidaniel.ro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-placement="footer"
                  className="hover:text-white transition-colors"
                >
                  Consultanță
                </a>
              </li>
              <li>
                <Link href="/termeni" className="hover:text-white transition-colors">
                  Termeni & Condiții
                </Link>
              </li>
              <li>
                <Link href="/confidentialitate" className="hover:text-white transition-colors">
                  Confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Mail size={18} className="text-zinc-300" /> Contact
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-zinc-500" size={16} />
                <a
                  href="mailto:contact@stirilecrypto.ro"
                  className="hover:text-white transition-colors"
                >
                  contact@stirilecrypto.ro
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="shrink-0 text-zinc-500" size={16} />
                <span>Luni – Vineri, 09:00 – 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 space-y-2">
          <p className="text-xs leading-relaxed text-zinc-500">
            Știrile Crypto este operată de {SITE_OPERATOR.name}, cu sediul la {SITE_OPERATOR.address}.{' '}
            {SITE_OPERATOR.taxIdLabel}: {SITE_OPERATOR.taxId}. Redactor:{' '}
            <Link href="/autori/daniel-mihai" className="text-zinc-300 underline decoration-white/20 underline-offset-2 hover:text-white">
              Daniel Mihai
            </Link>
            .{' '}
            <Link href="/despre#date-operator" className="text-zinc-300 underline decoration-white/20 underline-offset-2 hover:text-white">
              Date operator
            </Link>
            .
          </p>
          <p className="text-xs text-zinc-500">
            © {currentYear} Știrile Crypto. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}
