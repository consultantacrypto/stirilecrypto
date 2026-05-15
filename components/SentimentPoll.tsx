'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

export default function SentimentPoll() {
  const [voted, setVoted] = useState<string | null>(null);
  const [stats, setStats] = useState({ bull: 68, bear: 32, votes: 1245 });

  // Simulăm salvarea votului în browser ca să nu voteze de 10 ori
  useEffect(() => {
    const savedVote = localStorage.getItem('md_sentiment_vote_today');
    if (savedVote) setVoted(savedVote);
  }, []);

  const handleVote = (type: 'bull' | 'bear') => {
    setVoted(type);
    localStorage.setItem('md_sentiment_vote_today', type);
    
    // Simulăm un update live al cifrelor (în realitate ar fi un API call)
    setStats(prev => ({
      bull: type === 'bull' ? prev.bull + 1 : prev.bull - 1,
      bear: type === 'bear' ? prev.bear + 1 : prev.bear - 1,
      votes: prev.votes + 1
    }));
  };

  return (
    <div className="bg-[#0a0f1e] border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Sentimentul Pieței
        </h3>
        <span className="text-[10px] text-gray-500 flex items-center gap-1">
           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
           {stats.votes.toLocaleString()} Voturi Azi
        </span>
      </div>

      {!voted ? (
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => handleVote('bull')}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500 transition-all group"
            >
                <TrendingUp className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-green-300">BULLISH</span>
            </button>
            <button 
                onClick={() => handleVote('bear')}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500 transition-all group"
            >
                <TrendingDown className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-red-300">BEARISH</span>
            </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Bullish Bar */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-green-400">🐂 Bullish</span>
                    <span className="text-white">{stats.bull}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${stats.bull}%` }}></div>
                </div>
            </div>

            {/* Bearish Bar */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-red-400">🐻 Bearish</span>
                    <span className="text-white">{stats.bear}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${stats.bear}%` }}></div>
                </div>
            </div>

            <p className="text-[10px] text-center text-gray-500 mt-2">
                Ai votat <strong>{voted === 'bull' ? 'BULLISH' : 'BEARISH'}</strong>. Vino mâine pentru un nou vot!
            </p>
        </div>
      )}
    </div>
  );
}