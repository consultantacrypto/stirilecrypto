'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Trophy, Lock, Unlock, Gift } from 'lucide-react';
import Link from 'next/link';

export default function AlphaStreak() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Recompensele
  const nextMilestone = streak < 7 ? 7 : (streak < 30 ? 30 : 100);
  const progress = Math.min((streak / nextMilestone) * 100, 100);

  useEffect(() => {
    // Logica de "Check-in" Zilnic
    const checkStreak = () => {
      const today = new Date().toISOString().split('T')[0]; // Data de azi (YYYY-MM-DD)
      const lastVisit = localStorage.getItem('md_last_visit');
      const currentStreak = parseInt(localStorage.getItem('md_streak') || '0');

      if (lastVisit === today) {
        // A mai fost azi, nu schimbăm nimic
        setStreak(currentStreak);
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastVisit === yesterdayString) {
          // A fost ieri -> Incrementăm seria! 🔥
          const newStreak = currentStreak + 1;
          setStreak(newStreak);
          localStorage.setItem('md_streak', newStreak.toString());
        } else {
          // Nu a fost ieri -> Resetăm seria la 1 :(
          setStreak(1);
          localStorage.setItem('md_streak', '1');
        }
        localStorage.setItem('md_last_visit', today);
      }
      setLoading(false);
    };

    checkStreak();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-gradient-to-br from-[#0a0f1e] to-orange-900/10 border border-orange-500/20 rounded-2xl p-5 relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-sm font-black text-white flex items-center gap-2 italic">
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-gray-600'}`} /> 
            ALPHA STREAK
        </h3>
        <div className="text-2xl font-black text-orange-400 font-[var(--font-space)]">
            {streak} <span className="text-xs text-gray-400 font-sans font-normal">ZILE</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-3">
         <div 
            className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-1000" 
            style={{ width: `${progress}%` }}
         ></div>
      </div>
      
      <p className="text-[10px] text-gray-400 mb-4 flex justify-between">
         <span>Nivel Actual: <strong>{streak < 7 ? 'Rookie' : (streak < 30 ? 'Insider' : 'Whale 🐋')}</strong></span>
         <span>Ținta: {nextMilestone} Zile</span>
      </p>

      {/* Reward Area */}
      <div className={`p-3 rounded-xl border ${streak >= 7 ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-900 border-gray-700 border-dashed'} transition-all`}>
         {streak >= 7 ? (
             <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                    <Unlock size={16} />
                </div>
                <div>
                    <div className="text-xs font-bold text-white">RECOMPENSĂ DEBLOCATĂ!</div>
                    <Link href="/ghid-securitate-pdf" className="text-[10px] text-green-400 underline hover:text-green-300">
                        Descarcă Ghidul de Securitate
                    </Link>
                </div>
             </div>
         ) : (
             <div className="flex items-center gap-3 opacity-60">
                <div className="p-2 bg-gray-800 rounded-full text-gray-500">
                    <Lock size={16} />
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-300">Bonus la 7 Zile</div>
                    <div className="text-[10px] text-gray-500">Ghid Securitate PDF (Exclusiv)</div>
                </div>
             </div>
         )}
      </div>

      {/* Mesaj Motivațional */}
      <div className="mt-3 text-center">
         {streak === 0 ? (
            <span className="text-[10px] text-orange-300 animate-pulse">Începe azi! Vino și mâine pentru a aprinde flacăra. 🔥</span>
         ) : (
            <span className="text-[10px] text-green-400">Excelent! Menține seria pentru a debloca reduceri.</span>
         )}
      </div>

      {/* Background Glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

    </div>
  );
}