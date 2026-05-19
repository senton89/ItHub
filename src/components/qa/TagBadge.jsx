import Link from 'next/link';

export default function TagBadge({ tag, count }) {
  return (
    <Link href={`/questions?tag=${tag.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:shadow-sm" style={{ backgroundColor: `${tag.color}15`, color: tag.color, border: `1px solid ${tag.color}30` }}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
      {tag.name}
      {count !== undefined && (
        <span className="text-xs opacity-60">×{count}</span>
      )}
    </Link>
  );
}
