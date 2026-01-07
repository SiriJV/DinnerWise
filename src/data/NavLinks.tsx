import type { ReactNode } from 'react';

export type NavLinkItem = {
  title?: string;
  label: string;
  path: string;
  element: ReactNode;
};

export const navLinks: NavLinkItem[] = [
  {
    label: 'Litteratur och skrivande',
    path: 'litteratur-och-skrivande',
    element: <div>Litteratur och skrivande</div>,
  },
  {
    label: 'Musik',
    path: 'musik',
    element: <div>Musik</div>,
  },
  {
    label: 'Natur och friluftsliv',
    path: 'natur-och-friluftsliv',
    element: <div>Natur och friluftsliv</div>,
  },
  {
    label: 'IT och teknik',
    path: 'it-och-teknik',
    element: <div>IT och teknik</div>,
  },
  {
    label: 'Språk',
    path: 'sprak',
    element: <div>Språk</div>,
  },
  {
    label: 'Konst och kultur',
    path: 'konst-och-kultur',
    element: <div>Konst och kultur</div>,
  },
  {
    label: 'Sport och träning',
    path: 'sport-och-träning',
    element: <div>Sport och träning</div>,
  },
];

type AccordionPanelItem = {
  label: string;
  path: string;
  element: ReactNode;
};

interface AccordionItem {
  value: string;
  label: string;
  panels: AccordionPanelItem[];
}

export const accordionItems: AccordionItem[] = [
  {
    value: 'dinnerwise',
    label: 'DinnerWise',
    panels: [
      { label: 'Om oss', path: '/om-oss', element: <div>Om oss</div> },
      {
        label: 'Nyhetsbrev',
        path: '/nyhetsbrev',
        element: <div>Nyhetsbrev</div>,
      },
    ],
  },
  {
    value: 'account',
    label: 'Ditt konto',
    panels: [
      {
        label: 'Skapa konto',
        path: '/skapa-konto',
        element: <div>Skapa konto</div>,
      },
      { label: 'Logga in', path: '/logga-in', element: <div>Logga in</div> },
      { label: 'Hjälp', path: '/hjalp', element: <div>Hjälp</div> },
    ],
  },
  {
    value: 'help',
    label: 'Hjälp',
    panels: [
      { label: 'Betalning', path: '/betalning', element: <div>Betalning</div> },
      { label: 'FAQ', path: '/faq', element: <div>FAQ</div> },
      {
        label: 'Köpvillkor',
        path: '/kopvillkor',
        element: <div>Köpvillkor</div>,
      },
      {
        label: 'Integritetspolicy',
        path: '/integritetspolicy',
        element: <div>Integritetspolicy</div>,
      },
    ],
  },
  {
    value: 'contact',
    label: 'Kontakt',
    panels: [
      {
        label: 'Kundservice',
        path: '/kundservice',
        element: <div>Kundservice</div>,
      },
      { label: 'Kontakt', path: '/kontakt', element: <div>Kontakt</div> },
    ],
  },
  {
    value: 'social',
    label: 'Följ oss',
    panels: [
      { label: 'Instagram', path: '/instagram', element: <div>Instagram</div> },
      { label: 'Facebook', path: '/facebook', element: <div>Facebook</div> },
      { label: 'X', path: '/x', element: <div>X</div> },
    ],
  },
];
