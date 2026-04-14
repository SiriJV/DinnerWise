import { getStaticLabel } from '../../utils/slugify';

export function formatLabel(value: string) {
  const decoded = decodeURIComponent(value);

  const match = getStaticLabel(decoded);
  if (match) return match;

  const fallback = decoded.replace(/-/g, ' ');
  return fallback.charAt(0).toUpperCase() + fallback.slice(1);
}

export function isHiddenSegment(value: string) {
  return ['event', 'stad', 'restaurang', 'kategori', 'tagg'].includes(value);
}
