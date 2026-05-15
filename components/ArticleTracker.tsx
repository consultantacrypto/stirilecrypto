'use client';

import { useEffect } from 'react';

export default function ArticleTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // 1. Citim lista actuală de articole citite
    const saved = localStorage.getItem('mihai_academy_progress');
    let readArticles = saved ? JSON.parse(saved) : [];

    // 2. Dacă articolul curent nu e în listă, îl adăugăm
    if (!readArticles.includes(slug)) {
      readArticles.push(slug);
      // 3. Salvăm înapoi în "creierul" browserului
      localStorage.setItem('mihai_academy_progress', JSON.stringify(readArticles));
      
      // Opțional: Putem declanșa un eveniment ca să se actualizeze UI-ul instant (dacă avem nevoie)
      window.dispatchEvent(new Event('storage'));
    }
  }, [slug]);

  // Această componentă nu randează nimic vizibil, e doar logică
  return null;
}