import Link from 'next/link';
import { EDITORIAL_DESK_NAME, EDITORIAL_DESK_PATH } from '@/lib/json-ld';

type EditorialBylineProps = {
  className?: string;
  prefix?: string;
};

export default function EditorialByline({
  className = '',
  prefix,
}: EditorialBylineProps) {
  return (
    <span className={className}>
      {prefix ? `${prefix} ` : null}
      <Link
        href={EDITORIAL_DESK_PATH}
        className="text-white font-bold hover:text-blue-400 transition-colors"
      >
        {EDITORIAL_DESK_NAME}
      </Link>
    </span>
  );
}
