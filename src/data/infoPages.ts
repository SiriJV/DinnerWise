import AboutPage from '../routes/info pages/AboutPage';
import FAQPage from '../routes/info pages/FAQPage';
import HelpPage from '../routes/info pages/HelpPage';
import PaymentInfoPage from '../routes/info pages/PaymentInfoPage';
import SupportPage from '../routes/info pages/SupportPage';
import TermsPage from '../routes/info pages/TermsPage';
import PrivacyPage from '../routes/info pages/PrivacyPage';
import ContactPage from '../routes/info pages/ContactPage';
import NewsletterPage from '../routes/info pages/NewsletterPage';
import HowToPage from '../routes/info pages/HowToPage';
import AccountPage from '../routes/info pages/AccountPage';
import CookiesPage from '../routes/info pages/CookiesPage';

export const infoPages = [
  { path: '/om-oss', component: AboutPage },
  { path: '/installningar', component: AccountPage },
  { path: '/kontakt', component: ContactPage },
  { path: '/cookies', component: CookiesPage },
  { path: '/faq', component: FAQPage },
  { path: '/hjalp', component: HelpPage },
  { path: '/att-skapa-event', component: HowToPage },
  { path: '/nyhetsbrev', component: NewsletterPage },
  { path: '/betalning', component: PaymentInfoPage },
  { path: '/integritetspolicy', component: PrivacyPage },
  { path: '/kundservice', component: SupportPage },
  { path: '/kopvillkor', component: TermsPage },
];
