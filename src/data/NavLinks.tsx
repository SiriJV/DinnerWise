import type { ReactNode } from 'react';
import AboutPage from '../routes/info pages/AboutPage';
import CreateAccountPage from '../routes/info pages/CreateAccountPage';
import LiteraturePage from '../routes/category pages/LiteraturePage';
import MusicPage from '../routes/category pages/MusicPage';
import SportPage from '../routes/category pages/SportPage';
import ArtsPage from '../routes/category pages/ArtsPage';
import NaturePage from '../routes/category pages/NaturePage';
import ITPage from '../routes/category pages/ITPage';
import LanguagePage from '../routes/category pages/LanguagePage';
import PaymentInfoPage from '../routes/info pages/PaymentInfoPage';
import FAQPage from '../routes/info pages/FAQPage';
import TermsPage from '../routes/info pages/TermsPage';
import PrivacyPage from '../routes/info pages/PrivacyPage';
import ContactPage from '../routes/info pages/ContactPage';
import SupportPage from '../routes/info pages/SupportPage';
import LoginPage from '../routes/info pages/LoginPage';
import HelpPage from '../routes/info pages/HelpPage';
import NewsletterPage from '../routes/info pages/NewsletterPage';

type NavLinkItem = {
  label: string;
  path: string;
  element: ReactNode;
  image: string;
};

export const navLinks: NavLinkItem[] = [
  {
    label: 'Litteratur och skrivande',
    path: 'litteratur-och-skrivande',
    element: LiteraturePage(),
    image: 'https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd',
  },
  {
    label: 'Musik',
    path: 'musik',
    element: MusicPage(),
    image: 'https://images.unsplash.com/photo-1543062058-de8a92799761',
  },
  {
    label: 'Natur och friluftsliv',
    path: 'natur-och-friluftsliv',
    element: NaturePage(),
    image: 'https://images.unsplash.com/photo-1534049971341-c6bc3215ed2a',
  },
  {
    label: 'IT och teknik',
    path: 'it-och-teknik',
    element: ITPage(),
    image: 'https://images.unsplash.com/photo-1573495804683-641191e042ea',
  },
  {
    label: 'Språk',
    path: 'sprak',
    element: LanguagePage(),
    image: 'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3',
  },
  {
    label: 'Konst och kultur',
    path: 'konst-och-kultur',
    element: ArtsPage(),
    image: 'https://images.unsplash.com/photo-1714508862788-44e45c4315d0',
  },
  {
    label: 'Sport och träning',
    path: 'sport-och-träning',
    element: SportPage(),
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5',
  },
];

type AccordionPanelItem = {
  label: string;
  path: string;
  element: ReactNode;
};

type AccordionItem = {
  value: string;
  label: string;
  panels: AccordionPanelItem[];
};

export const accordionItems: AccordionItem[] = [
  {
    value: 'dinnerwise',
    label: 'DinnerWise',
    panels: [
      { label: 'Om oss', path: '/om-oss', element: AboutPage() },
      {
        label: 'Nyhetsbrev',
        path: '/nyhetsbrev',
        element: NewsletterPage(),
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
        element: CreateAccountPage(),
      },
      { label: 'Logga in', path: '/logga-in', element: LoginPage() },
      { label: 'Hjälp', path: '/hjalp', element: HelpPage() },
    ],
  },
  {
    value: 'help',
    label: 'Hjälp',
    panels: [
      { label: 'Betalning', path: '/betalning', element: PaymentInfoPage() },
      { label: 'FAQ', path: '/faq', element: FAQPage() },
      {
        label: 'Köpvillkor',
        path: '/kopvillkor',
        element: TermsPage(),
      },
      {
        label: 'Integritetspolicy',
        path: '/integritetspolicy',
        element: PrivacyPage(),
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
        element: SupportPage(),
      },
      { label: 'Kontakt', path: '/kontakt', element: ContactPage() },
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
