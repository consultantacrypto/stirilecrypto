"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { 
  LayoutGrid, 
  Bitcoin, 
  Layers, 
  Landmark, 
  GraduationCap, 
  Zap 
} from 'lucide-react';

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const categories = [
    { id: 'all', label: 'Toate', icon: LayoutGrid, color: 'text-gray-400' },
    { id: 'btc', label: 'Bitcoin', icon: Bitcoin, color: 'text-orange-500' },
    { id: 'eth', label: 'Ethereum', icon: Zap, color: 'text-purple-500' }, // Folosim Zap pt ETH ca simbol de putere/gas
    { id: 'macro', label: 'Macro & Fed', icon: Landmark, color: 'text-green-500' },
    { id: 'alts', label: 'Altcoins', icon: Layers, color: 'text-blue-500' },
    { id: 'edu', label: 'Educație', icon: GraduationCap, color: 'text-pink-500' },
  ];

  const handleFilter = (catId: string) => {
    const params = new URLSearchParams(window.location.search);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    params.delete('page'); // Resetăm la pagina 1 când schimbăm filtrul
    router.push(`/stiri?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full mb-12 overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-center gap-3 md:justify-center min-w-max px-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = currentCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.id)}
              className={`
                relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300
                border
                ${isActive 
                  ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105' 
                  : 'bg-[#0a0f1e]/50 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300 hover:bg-[#0a0f1e]'
                }
              `}
            >
              {/* Glow activ */}
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl pointer-events-none" />
              )}
              
              <Icon size={18} className={isActive ? cat.color : 'opacity-50'} />
              <span className="whitespace-nowrap font-[var(--font-space)] text-sm">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}