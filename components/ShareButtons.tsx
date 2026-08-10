'use client';

import { Twitter, Linkedin, Link as LinkIcon, Check, Send } from 'lucide-react';
import { useState } from 'react';
import { SITE_URL } from '@/lib/json-ld';
import { trackEvent } from '@/lib/analytics';

interface ShareButtonsProps {
  title: string;
  slug: string;
  /** Full path without domain, e.g. `/interviuri/my-slug`. Defaults to `/stiri/{slug}`. */
  sharePath?: string;
}

export default function ShareButtons({ title, slug, sharePath }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const path = sharePath ?? `/stiri/${slug}`;
  const url = `${SITE_URL}${path}`;
  const text = `${title} \n\nCitește analiza completă aici:`;

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&via=MihaiDanielWeb3`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  };

  const trackShare = (platform: string) => {
    trackEvent('social_share', {
      platform,
      page: typeof window !== 'undefined' ? window.location.pathname : path,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    trackShare('copy_link');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <a
        href={shareLinks.x}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare('twitter')}
        className="flex items-center gap-2 px-4 py-2 min-h-12 bg-black hover:bg-zinc-800 border border-white/10 rounded-lg text-white text-sm font-bold transition-all hover:scale-105 shadow-lg"
        aria-label="Share on X"
      >
        <Twitter size={16} /> Post
      </a>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare('whatsapp')}
        className="flex items-center gap-2 px-4 py-2 min-h-12 bg-[#25D366] hover:bg-[#20bd5a] text-black rounded-lg text-sm font-bold transition-all hover:scale-105 shadow-lg"
        aria-label="Share on WhatsApp"
      >
        <Send size={16} /> WhatsApp
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare('linkedin')}
        className="flex items-center gap-2 px-4 py-2 min-h-12 bg-[#0077b5] hover:bg-[#006396] rounded-lg text-white text-sm font-bold transition-all hover:scale-105 shadow-lg"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} /> Share
      </a>

      <button
        type="button"
        onClick={copyToClipboard}
        className="flex items-center gap-2 px-4 py-2 min-h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm font-bold transition-all active:scale-95"
        aria-label="Copy Link"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <LinkIcon size={16} />}
        {copied ? 'Copiat!' : 'Link'}
      </button>
    </div>
  );
}
