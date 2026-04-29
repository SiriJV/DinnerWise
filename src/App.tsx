import '@mantine/core/styles.css';
import './App.scss';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { svSE } from '@clerk/localizations';
import { theme } from './theme';
import AppShell from './components/AppShell/AppShell';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import LoginModal from './components/Modals/LoginModal/LoginModal';
import CreateAccountModal from './components/Modals/CreateAccountModal/CreateAccountModal';
import CreateEventModal from './components/Modals/CreateEventModal/CreateEventModal';
import { useModal } from './contexts/ModalContext';
// import HomePage from './routes/HomePage/HomePage';
// import CookiesPage from './routes/info pages/CookiesPage';
// import EventDetails from './routes/EventDetails/EventDetails';
// import RestaurangDetails from './routes/RestaurantDetails/RestaurantDetails';
// import SearchPage from './routes/SearchPage';
// import ProfilePage from './routes/ProfilePage/ProfilePage';
// import CreateEventPage from './routes/CreateEventPage/CreateEventPage';
// import SelectRestaurantPage from './routes/SelectRestaurantPage/SelectRestaurantPage';
// import CategoryPage from './routes/CategoryPage/CategoryPage';
// import TagPage from './routes/TagPage/TagPage';
// import CityPage from './routes/CityPage/CityPage';
import TestAuthPage from './routes/TestAuthPage/TestAuthPage';
import TestAccountPage from './routes/TestAccountPage/TestAccountPage';
import AdminLoginPage from './routes/AdminLoginPage/AdminLoginPage';
import AdminPanelPage from './routes/AdminPanelPage/AdminPanelPage';
import AcceptInvitationPage from './routes/AcceptInvitationPage/AcceptInvitationPage';
import { infoPages } from './data/infoPages';
import { lazy, useEffect, useState } from 'react';
import Settings from './routes/ProfilePage/Settings/Settings';

// Lazy load alla route-komponenter för bättre initial laddning
const HomePage = lazy(() => import('./routes/HomePage/HomePage'));
const EventDetails = lazy(() => import('./routes/EventDetails/EventDetails'));
const ProfilePage = lazy(() => import('./routes/ProfilePage/ProfilePage'));
const SearchPage = lazy(() => import('./routes/SearchPage'));
const RestaurantDetails = lazy(
  () => import('./routes/RestaurantDetails/RestaurantDetails'),
);
const CategoryPage = lazy(() => import('./routes/CategoryPage/CategoryPage'));
const TagPage = lazy(() => import('./routes/TagPage/TagPage'));
const CityPage = lazy(() => import('./routes/CityPage/CityPage'));
const RestaurantAcceptancePage = lazy(
  () => import('./routes/RestaurantAcceptancePage/RestaurantAcceptancePage'),
);
const EventFeedback = lazy(
  () => import('./routes/EventFeedback/EventFeedback'),
);
const GeminiTestPage = lazy(
  () => import('./routes/GeminiTestPage/GeminiTestPage'),
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <ModalProvider>
          <MantineProvider theme={theme}>
            <AppShell />
            <GlobalModals />
          </MantineProvider>
        </ModalProvider>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/sokresultat',
        element: <SearchPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/profil/:alias',
        element: <ProfilePage />,
      },
      {
        path: '/profil/:alias/installningar',
        element: <Settings />,
      },
      {
        path: '/event/:slug',
        element: <EventDetails />,
      },
      {
        path: '/event/:slug/feedback',
        element: <EventFeedback />,
      },
      {
        path: '/restaurang/:slug',
        element: <RestaurantDetails />,
      },
      {
        path: '/kategori/:slug',
        element: <CategoryPage />,
      },
      {
        path: '/stad/:slug',
        element: <CityPage />,
      },
      {
        path: '/tagg/:slug',
        element: <TagPage />,
      },
      {
        path: '/test-auth',
        element: <TestAuthPage />,
      },
      {
        path: '/test-account',
        element: <TestAccountPage />,
      },
      {
        path: '/admin-login',
        element: <AdminLoginPage />,
      },
      {
        path: '/accept-invitation',
        element: <AcceptInvitationPage />,
      },
      {
        path: '/bokningshantering/:slug',
        element: <RestaurantAcceptancePage />,
      },
      {
        path: '/test',
        element: <GeminiTestPage />,
      },
      ...infoPages.map(({ path, component: Comp }) => ({
        path,
        element: <Comp />,
      })),
    ],
  },
  {
    path: '/admin',
    element: (
      <MantineProvider theme={theme}>
        <AdminPanelPage />
      </MantineProvider>
    ),
  },
]);

function GlobalModals() {
  const {
    loginOpen,
    createOpen,
    closeModals,
    createEventOpen,
    closeCreateEvent,
  } = useModal();
  const [demoOpen, setDemoOpen] = useState(true);

  // Visa bara första gången sidan laddas
  useEffect(() => {
    setDemoOpen(true);
  }, []);

  return (
    <>
      {/* <DemoInfoModal opened={demoOpen} onClose={() => setDemoOpen(false)} /> */}
      <LoginModal opened={loginOpen} onClose={closeModals} />
      <CreateAccountModal opened={createOpen} onClose={closeModals} />
      <CreateEventModal opened={createEventOpen} onClose={closeCreateEvent} />
    </>
  );
}

export default function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    console.warn(
      '⚠️  VITE_CLERK_PUBLISHABLE_KEY is not set in .env.local\n' +
      '   Add it to enable the Clerk authentication test page (/test-auth).\n' +
      '   Key should start with pk_test_'
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey || ''}
      localization={svSE}
      signUpFallbackRedirectUrl="/"
      signInFallbackRedirectUrl="/"
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}
