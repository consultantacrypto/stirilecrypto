import { HERO_SLOGAN_LEAD, HERO_SLOGAN_TAIL } from '@/lib/hero-slogan';

export default function HeroSlogan() {
  return (
    <h1 className="hero-slogan-in font-[family-name:var(--font-space)] text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.035em] text-white sm:text-4xl lg:text-[3.15rem]">
      {HERO_SLOGAN_LEAD}{' '}
      <span className="text-zinc-400">{HERO_SLOGAN_TAIL}</span>
    </h1>
  );
}
