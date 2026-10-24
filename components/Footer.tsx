'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { NEWSLETTER_WAITLIST_VISIBLE } from '@/lib/newsletter';
import { SOCIAL_LINKS } from '@/lib/social';
import { MAJOR_PRICE_RON } from '@/lib/products/tiers';
import MorningNewsletter from '@/components/MorningNewsletter';

const COL = 'text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9eb4f0]';
const LINK = 'text-sm text-slate-400 transition-colors hover:text-white';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#07080b] font-[family-name:var(--font-inter)]">
      <div className="site-wrap py-12">
        <div className="grid gap-8 border-b border-white/[0.08] pb-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold tracking-tighter text-black">
                ȘC
              </span>
              <span className="font-[family-name:var(--font-space)] text-lg font-semibold tracking-[-0.02em] text-white">
                Știrile Crypto
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Știri crypto, analiză on-chain și context de piață, în limba română.
            </p>
          </div>
          <MorningNewsletter id="newsletter-footer" location="footer" variant="compact" />
        </div>

        <div className="grid grid-cols-2 gap-8 pt-10 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <h2 className={COL}>Site</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/incepe-aici" className={LINK}>Începe aici</Link></li>
              <li><Link href="/market" className={LINK}>Piața azi</Link></li>
              <li><Link href="/stiri" className={LINK}>Știri</Link></li>
              <li><Link href="/market-pulse" className={LINK}>Pulsul Bitcoin</Link></li>
              <li><Link href="/interviuri" className={LINK}>Față în față cu Dani</Link></li>
              <li><Link href="/lichidari" className={LINK}>Harta pieței</Link></li>
              <li><Link href="/dashboard" className={LINK}>Tablou</Link></li>
              <li><Link href="/raport-strategic" className={LINK}>Ce cumpără balenele</Link></li>
            </ul>
          </div>

          <div>
            <h2 className={COL}>Servicii</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/analiza-tehnica?src=footer" className={LINK}>
                  Analiză tehnică, de la {MAJOR_PRICE_RON} lei
                </Link>
              </li>
              <li>
                <Link href="/verificare-portofel?src=footer" className={LINK}>
                  Verificare portofel crypto
                </Link>
              </li>
              {NEWSLETTER_WAITLIST_VISIBLE ? (
                <li>
                  <Link href="/#newsletter" className={LINK}>Lista de așteptare</Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h2 className={COL}>Educație</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/academie" className={LINK}>Academia Crypto</Link></li>
              <li><Link href="/glosar" className={LINK}>Glosar</Link></li>
              <li><Link href="/taxe" className={LINK}>Taxe crypto 2026</Link></li>
            </ul>
          </div>

          <div>
            <h2 className={COL}>Social</h2>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK}
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
                  className={LINK}
                >
                  LinkedIn, Daniel Mihai
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={COL}>Legal</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/despre" className={LINK}>Despre noi</Link></li>
              <li><Link href="/contact" className={LINK}>Contact</Link></li>
              <li><Link href="/autori/daniel-mihai" className={LINK}>Daniel Mihai, analist</Link></li>
              <li>
                <a href="https://www.mihaidaniel.ro/" target="_blank" rel="noopener noreferrer" className={LINK}>
                  Consultanță
                </a>
              </li>
              <li><Link href="/termeni" className={LINK}>Termeni și condiții</Link></li>
              <li><Link href="/confidentialitate" className={LINK}>Confidențialitate</Link></li>
              <li><Link href="/cookies" className={LINK}>Cookies</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-slate-500">
          © {currentYear} Știrile Crypto. Luni – vineri, 09:00 – 18:00.{' '}
          <a href="mailto:contact@stirilecrypto.ro" className="hover:text-white">
            contact@stirilecrypto.ro
          </a>
        </p>
      </div>
    </footer>
  );
}
