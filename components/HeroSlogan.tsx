import { HERO_SLOGAN_LEAD, HERO_SLOGAN_TAIL } from '@/lib/hero-slogan';

export default function HeroSlogan() {
  return (
    <h1 className="hero-slogan-in font-[family-name:var(--font-space)] text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
      {HERO_SLOGAN_LEAD}{' '}
      <span className="text-gray-400">{HERO_SLOGAN_TAIL}</span>
    </h1>
  );
}
