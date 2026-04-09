import AboutPage from '../routes/info pages/AboutPage';
import FAQPage from '../routes/info pages/FAQPage/FAQPage';
import PaymentInfoPage from '../routes/info pages/PaymentInfoPage';
import TermsPage from '../routes/info pages/TermsPage';
import PrivacyPage from '../routes/info pages/PrivacyPage';
import ContactPage from '../routes/info pages/ContactPage';
import NewsletterPage from '../routes/info pages/NewsletterPage';
import HowToPage from '../routes/info pages/HowToPage/HowToPage';
import CookiesPage from '../routes/info pages/CookiesPage';

export const infoPages = [
  { path: '/om-oss', component: AboutPage },
  { path: '/kontakt', component: ContactPage },
  { path: '/cookies', component: CookiesPage },
  { path: '/faq', component: FAQPage },
  { path: '/att-skapa-event', component: HowToPage },
  { path: '/nyhetsbrev', component: NewsletterPage },
  { path: '/betalning', component: PaymentInfoPage },
  { path: '/integritetspolicy', component: PrivacyPage },
  { path: '/kopvillkor', component: TermsPage },
];
