import AboutPage from '../routes/info pages/AboutPage';
import FAQPage from '../routes/info pages/FAQPage';
import HelpPage from '../routes/info pages/HelpPage';
import PaymentInfoPage from '../routes/info pages/PaymentInfoPage';
import SupportPage from '../routes/info pages/SupportPage';
import TermsPage from '../routes/info pages/TermsPage';
import PrivacyPage from '../routes/info pages/PrivacyPage';
import ContactPage from '../routes/info pages/ContactPage';
import NewsletterPage from '../routes/info pages/NewsletterPage';

export const infoPages = [
  { path: '/om-oss', component: AboutPage },
  { path: '/faq', component: FAQPage },
  { path: '/hjalp', component: HelpPage },
  { path: '/betalning', component: PaymentInfoPage },
  { path: '/kundservice', component: SupportPage },
  { path: '/kopvillkor', component: TermsPage },
  { path: '/integritetspolicy', component: PrivacyPage },
  { path: '/kontakt', component: ContactPage },
  { path: '/nyhetsbrev', component: NewsletterPage },
];
