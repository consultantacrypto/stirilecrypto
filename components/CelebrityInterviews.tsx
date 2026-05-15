'use client';

import { useState } from 'react';
import { Play, Star, Tv, ExternalLink } from 'lucide-react';
// 1. IMPORTĂM COMPONENTA DE IMAGINE NEXT.JS
import Image from 'next/image';

// LISTA VIDEO OFICIALĂ
const VIDEOS = [
  { 
    id: 'e6fT2y3DkqI', 
    title: '💥 Ben Zhou, Bybit Founder - Bear Market Is Over! 🌟 Interviu cu fondatorul Bybit' 
  },
  { 
    id: '59HJsgv8lbI', 
    title: 'Super Interviu cu Rohit Wad (Binance CTO) - Directorul de Tehnologie Binance' 
  },
  { 
    id: 'IMNUP11X93w', 
    title: "Binance's Top Manager Kyrylo Khomiakov (Regional Head CEE) - Interviu Exclusiv" 
  },
  { 
    id: 'cQx2EFPN2ZI', 
    title: 'Mike Silagadze, Founder and CEO of Ether.fi - Restaking Revolution' 
  },
  { 
    id: 'BJ-qiaGsIaY', 
    title: 'Podcast - Dmitry Buterin (Vitalik Buterin Father) - Ethereum Roots' 
  },
  { 
    id: 'CdBYX3NPfbA', 
    title: 'Bitcoin va valora 5.000.000$! Asta este părerea lui MMCrypto' 
  },
  { 
    id: 'SVcy0DJEuoQ', 
    title: 'Usual CEO Pierre Person interview just after project got listed on Binance' 
  },
  { 
    id: 'zcZ-SKhJhqM', 
    title: 'Super Podcast cu Davinci Jeremie - Bitcoin OG' 
  },
];

const VideoCard = ({ id, title }: { id: string, title: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <article className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0a0f1e] shadow-lg aspect-video hover:border-purple-500/50 transition-all duration-300">
      {!isPlaying ? (
        // --- LITE MODE (Imagine Optimizată Next.js) ---
        <div 
          className="cursor-pointer relative w-full h-full"
          onClick={() => setIsPlaying(true)}
          role="button"
          aria-label={`Redă video: ${title}`}
        >
          {/* ✅ OPTIMIZARE MAJORĂ:
             Folosim <Image /> care taie automat dimensiunea pozei.
             'sizes' spune browserului cât loc ocupă pe ecran, ca să nu descarce poza full HD pe mobil.
          */}
          <Image 
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`} 
            alt={`Thumbnail pentru video: ${title}`}
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          
          {/* Buton Play Custom */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform z-10">
              <Play size={32} className="text-white fill-white ml-1"/>
            </div>
            {/* Pulsing Effect */}
            <div className="absolute w-16 h-16 bg-red-600 rounded-full animate-ping opacity-20"></div>
          </div>
          
          {/* Titlu Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-snug">{title}</h3>
          </div>
        </div>
      ) : (
        // --- HEAVY MODE (Iframe real) - Se activează doar la click ---
        <iframe 
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`} 
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="w-full h-full absolute inset-0"
        ></iframe>
      )}
    </article>
  );
};

export default function CelebrityInterviews() {
  return (
    <section className="py-20 relative bg-[#020617] border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-900/5 blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest mb-4 uppercase shadow-lg shadow-purple-500/10">
                <Star size={14} className="text-yellow-400 fill-yellow-400"/> Hall of Fame Interviews
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                Discuții cu <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Giganții Industriei</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Nu vorbesc din cărți. Am acces direct la masa deciziilor. <br className="hidden md:block"/>
                De la <b className="text-white">CEO-ul Bybit</b> și <b className="text-white">Executivii Binance</b>, 
                la fondatorul <b className="text-white">Ether.fi</b> și <b className="text-white">Dmitry Buterin</b>.
            </p>
        </div>

        {/* GRID VIDEO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {VIDEOS.map((video) => (
                <VideoCard key={video.id} id={video.id} title={video.title} />
            ))}
        </div>

        {/* Social Proof Footer */}
        <div className="mt-12 text-center">
            <a 
              href="https://www.youtube.com/@DanielMihaiCrypto" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all group text-sm"
            >
                <Tv size={18} className="text-red-500"/> 
                Vezi toate interviurile pe YouTube
                <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors"/>
            </a>
        </div>

      </div>
    </section>
  );
}