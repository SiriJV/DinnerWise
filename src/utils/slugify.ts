import { staticRouteLabels } from '../data/staticRouteLabels';

export function generateEventSlug(title: string, id: number): string {
  return `${slugify(title)}-${id}`;
}

export function generateRestaurantSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}
export function slugify(text?: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

// export function generateEventSlug(title: string, id: number): string {
//   return `${slugify(title)}-${id}`;
// }

// export function generateRestaurantSlug(name: string, id: number): string {
//   return `${slugify(name)}-${id}`;
// }

// export function generateCategorySlug(name: string): string {
//   return slugify(name);
// }

export function extractIdFromSlug(slug: string): number | null {
  // Support both 'slug-id' and 'slug/id' formats
  let id: number | null = null;
  if (slug.includes('-')) {
    const parts = slug.split('-');
    id = parseInt(parts[parts.length - 1]);
  }
  return isNaN(id!) ? null : id;
}

export function getStaticLabel(slug: string): string | undefined {
  return staticRouteLabels.find((label) => slugify(label) === slug);
}
