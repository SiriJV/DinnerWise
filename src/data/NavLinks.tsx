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
  title?: string;
  label: string;
  path: string;
  element: ReactNode;
};

export const navLinks: NavLinkItem[] = [
  {
    label: 'Litteratur och skrivande',
    path: 'litteratur-och-skrivande',
    element: LiteraturePage(),
  },
  {
    label: 'Musik',
    path: 'musik',
    element: MusicPage(),
  },
  {
    label: 'Natur och friluftsliv',
    path: 'natur-och-friluftsliv',
    element: NaturePage(),
  },
  {
    label: 'IT och teknik',
    path: 'it-och-teknik',
    element: ITPage(),
  },
  {
    label: 'Språk',
    path: 'sprak',
    element: LanguagePage(),
  },
  {
    label: 'Konst och kultur',
    path: 'konst-och-kultur',
    element: ArtsPage(),
  },
  {
    label: 'Sport och träning',
    path: 'sport-och-träning',
    element: SportPage(),
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
