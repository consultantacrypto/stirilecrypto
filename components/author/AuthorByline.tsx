import Link from 'next/link';
import EditorialByline from '@/components/EditorialByline';
import { DANIEL_MIHAI, type AuthorKey } from '@/lib/authors';

export default function AuthorByline({ authorKey }: { authorKey: AuthorKey }) {
  if (authorKey === 'desk') return <EditorialByline />;

  return (
    <Link
      href={DANIEL_MIHAI.path}
      className="text-white font-bold hover:text-blue-400 transition-colors"
    >
      {DANIEL_MIHAI.name}
    </Link>
  );
}
