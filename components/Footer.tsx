'use client';

import Link from 'next/link';
import { Youtube, Twitter, Linkedin, Mail, MapPin, ShieldCheck, Globe, Clock } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

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
            <div className="flex gap-4">
              <SocialLink
                href="https://www.youtube.com/@DanielMihaiCrypto"
                icon={<Youtube size={20} />}
                label="YouTube"
                platform="youtube"
              />
              <SocialLink
                href="https://x.com/MIhaiDanielWeb3"
                icon={<Twitter size={20} />}
                label="Twitter/X"
                platform="twitter"
              />
              <SocialLink
                href="https://www.linkedin.com/"
                icon={<Linkedin size={20} />}
                label="LinkedIn"
                platform="linkedin"
              />
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Globe size={18} className="text-blue-500" /> Platformă
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/market" className="hover:text-blue-400 transition-colors">
                  Market Data (Live)
                </Link>
              </li>
              <li>
                <Link href="/stiri" className="hover:text-blue-400 transition-colors">
                  Știri & Analize
                </Link>
              </li>
              <li>
                <Link href="/academie" className="hover:text-blue-400 transition-colors">
                  Academia Crypto
                </Link>
              </li>
              <li>
                <Link href="/lichidari" className="hover:text-blue-400 transition-colors">
                  Lichidări Live
                </Link>
              </li>
              <li>
                <Link href="/#newsletter" className="hover:text-blue-400 transition-colors">
                  Newsletter
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
                <Link href="/termeni" className="hover:text-green-400 transition-colors">
                  Termeni & Condiții
                </Link>
              </li>
              <li>
                <Link href="/confidentialitate" className="hover:text-green-400 transition-colors">
                  Confidențialitate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-purple-500" /> Sediu
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 text-gray-600 shrink-0" size={16} />
                <span>
                  București, România
                  <br />
                  Piața Victoriei, Sector 1
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-gray-600 shrink-0" size={16} />
                <a
                  href="mailto:consultantacrypto.ro@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  consultantacrypto.ro@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="text-gray-600 shrink-0" size={16} />
                <span>Luni – Vineri, 09:00 – 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {currentYear} Știrile Crypto. Toate drepturile rezervate.
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-400 font-mono font-bold">
              SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon,
  label,
  platform,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  platform: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() =>
        trackEvent('social_share', {
          platform,
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
          location: 'footer',
        })
      }
      className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}
