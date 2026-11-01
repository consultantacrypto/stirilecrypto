import Link from 'next/link';
import { linkPhrases, type InlineLink } from '@/lib/inline-links';

const linkClass = 'text-blue-400 underline hover:text-blue-300';

export default function LinkedText({
  text,
  links = [],
  className,
}: {
  text: string;
  links?: readonly InlineLink[];
  className?: string;
}) {
  const segments = linkPhrases(text, links);

  return (
    <p className={className}>
      {segments.map((segment, index) => {
        if (typeof segment === 'string') return <span key={index}>{segment}</span>;
        if (segment.href.startsWith('http')) {
          return (
            <a
              key={index}
              href={segment.href}
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              {segment.text}
            </a>
          );
        }
        if (segment.href.startsWith('mailto:')) {
          return (
            <a key={index} href={segment.href} className={linkClass}>
              {segment.text}
            </a>
          );
        }
        return (
          <Link key={index} href={segment.href} className={linkClass}>
            {segment.text}
          </Link>
        );
      })}
    </p>
  );
}
