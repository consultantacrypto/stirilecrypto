import Link from 'next/link';
import EditorialByline from '@/components/EditorialByline';
import { authorByKey, isPersonAuthorKey, type AuthorKey } from '@/lib/authors';

export default function AuthorByline({ authorKey }: { authorKey: AuthorKey }) {
  if (!isPersonAuthorKey(authorKey)) return <EditorialByline />;

  const author = authorByKey(authorKey);
  return (
    <Link
      href={author.path}
      className="text-white font-bold hover:text-blue-400 transition-colors"
    >
      {author.name}
    </Link>
  );
}
