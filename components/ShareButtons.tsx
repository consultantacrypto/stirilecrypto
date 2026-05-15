'use client';

import { Twitter, Linkedin, Link as LinkIcon, Check, Send } from 'lucide-react';
import { useState } from 'react';

// ✅ ACEASTĂ PARTE ESTE CRITICĂ PENTRU A REZOLVA EROAREA
interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  // Construim link-ul complet
  const url = `https://mihaidaniel.ro/stiri/${slug}`;
  const text = `${title} \n\nCitește analiza completă aici:`;

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&via=MihaiDanielWeb3`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {/* Buton X (Twitter) */}
      <a
        href={shareLinks.x}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 border border-white/10 rounded-lg text-white text-sm font-bold transition-all hover:scale-105 shadow-lg"
        aria-label="Share on X"
      >
        <Twitter size={16} /> Post
      </a>

      {/* Buton WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-black rounded-lg text-sm font-bold transition-all hover:scale-105 shadow-lg"
        aria-label="Share on WhatsApp"
      >
        <Send size={16} /> WhatsApp
      </a>

      {/* Buton LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#0077b5] hover:bg-[#006396] rounded-lg text-white text-sm font-bold transition-all hover:scale-105 shadow-lg"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} /> Share
      </a>

      {/* Buton Copy Link */}
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm font-bold transition-all active:scale-95"
        aria-label="Copy Link"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <LinkIcon size={16} />}
        {copied ? 'Copiat!' : 'Link'}
      </button>
    </div>
  );
}