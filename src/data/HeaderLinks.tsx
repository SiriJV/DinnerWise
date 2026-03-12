export type HeaderLink = {
  path: string;
  label: string;
};

export const headerLinks: HeaderLink[] = [
  { path: '/stad/goteborg', label: 'Göteborg' },
  { path: '/stad/stockholm', label: 'Stockholm' },
  { path: '/stad/boras', label: 'Borås' },
  { path: '/kategori/musik', label: 'Musik' },
  { path: '/kategori/sprak', label: 'Språk' },
];
