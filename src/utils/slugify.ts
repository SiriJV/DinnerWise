export function slugify(text?: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export function generateEventSlug(title: string, id: number): string {
  return `${slugify(title)}-${id}`;
}

export function generateRestaurantSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}

export function generateCategorySlug(name: string): string {
  return slugify(name);
}

export function extractIdFromSlug(slug: string): number | null {
  const parts = slug.split('-');
  const id = parseInt(parts[parts.length - 1]);
  return isNaN(id) ? null : id;
}