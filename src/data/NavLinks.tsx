import type { ReactNode } from 'react';

export interface NavLinkItem {
  label: string;
  path: string;
  element: ReactNode;
}

export const navLinks: NavLinkItem[] = [
  {
    label: 'Litteratur och skrivande',
    path: 'litteratur',
    element: <div>Litteratur och skrivande</div>,
  },
  {
    label: 'Musik',
    path: 'musik',
    element: <div>Musik</div>,
  },
  {
    label: 'Natur och friluftsliv',
    path: 'natur',
    element: <div>Natur och friluftsliv</div>,
  },
  {
    label: 'IT och teknik',
    path: 'it',
    element: <div>IT och teknik</div>,
  },
  {
    label: 'Språk',
    path: 'sprak',
    element: <div>Språk</div>,
  },
  {
    label: 'Konst och kultur',
    path: 'konst',
    element: <div>Konst och kultur</div>,
  },
  {
    label: 'Sport och träning',
    path: 'sport',
    element: <div>Sport och träning</div>,
  },
];
