import type { ReactNode } from 'react';
import AboutPage from '../routes/info pages/AboutPage';
import PaymentInfoPage from '../routes/info pages/PaymentInfoPage';
import FAQPage from '../routes/info pages/FAQPage';
import TermsPage from '../routes/info pages/TermsPage';
import PrivacyPage from '../routes/info pages/PrivacyPage';
import ContactPage from '../routes/info pages/ContactPage';
import SupportPage from '../routes/info pages/SupportPage';
import HelpPage from '../routes/info pages/HelpPage';
import NewsletterPage from '../routes/info pages/NewsletterPage';
import ProfilePage from '../routes/ProfilePage/ProfilePage';
import HowToPage from '../routes/info pages/HowToPage';

type AccordionPanelItem = {
  label: string;
  path: string;
  element: ReactNode;
  modal?: 'login' | 'create' | 'logout';
};

type AccordionItems = {
  value: string;
  label: string;
  panels: AccordionPanelItem[];
};

export const getAccordionItems = (isLoggedIn: boolean): AccordionItems[] => [
  {
    value: 'dinnerwise',
    label: 'DinnerWise',
    panels: [
      { label: 'Om oss', path: '/om-oss', element: <AboutPage /> },
      {
        label: 'Nyhetsbrev',
        path: '/nyhetsbrev',
        element: <NewsletterPage />,
      },
      {
        label: 'Att skapa event',
        path: '/att-skapa-event',
        element: <HowToPage />,
      },
    ],
  },
  {
    value: 'account',
    label: isLoggedIn ? 'Mitt konto' : 'Ditt konto',
    panels: isLoggedIn
      ? [
          {
            label: 'Min profil',
            path: '/profil/anna_s',
            element: <ProfilePage />,
          },
          {
            label: 'Logga ut',
            path: '',
            element: null,
            modal: 'logout',
          },
        ]
      : [
          {
            label: 'Skapa konto',
            path: '',
            element: null,
            modal: 'create',
          },
          { label: 'Logga in', path: '', element: null, modal: 'login' },
        ],
  },
  {
    value: 'help',
    label: 'Hjälp & Support',
    panels: [
      { label: 'Hjälp', path: '/hjalp', element: <HelpPage /> },
      { label: 'FAQ', path: '/faq', element: <FAQPage /> },
      { label: 'Betalning', path: '/betalning', element: <PaymentInfoPage /> },
      {
        label: 'Kundservice',
        path: '/kundservice',
        element: <SupportPage />,
      },
    ],
  },
  {
    value: 'legal',
    label: 'Villkor & Integritet',
    panels: [
      {
        label: 'Köpvillkor',
        path: '/kopvillkor',
        element: <TermsPage />,
      },
      {
        label: 'Integritetspolicy',
        path: '/integritetspolicy',
        element: <PrivacyPage />,
      },
    ],
  },
  {
    value: 'contact',
    label: 'Kontakt',
    panels: [
      { label: 'Kontakta oss', path: '/kontakt', element: <ContactPage /> },
      { label: 'Instagram', path: '', element: <div>Instagram</div> },
      { label: 'Facebook', path: '', element: <div>Facebook</div> },
      { label: 'X', path: '', element: <div>X</div> },
    ],
  },
];

// Keep the old export for backward compatibility
export const accordionItems = getAccordionItems(false);
