import type { Metadata } from 'next';
import { CheckerFrame } from './frame';
import { checkerFormEmbedSrc } from '@/lib/products/placement';

export const metadata: Metadata = {
  title: 'Verifică portofelul înainte să trimiți bani',
  description: 'Afli dacă adresa crypto e legată de țepe, hackuri sau fonduri furate.',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <CheckerFrame
      title="Verifică portofelul înainte să trimiți bani"
      src={checkerFormEmbedSrc()}
    />
  );
}
