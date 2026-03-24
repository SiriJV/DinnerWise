import '@mantine/core/styles.css';
import './App.scss';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import AppShell from './components/AppShell/AppShell';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import LoginModal from './components/Modals/LoginModal/LoginModal';
import CreateAccountModal from './components/Modals/CreateAccountModal/CreateAccountModal';
import CreateEventModal from './components/Modals/CreateEventModal/CreateEventModal';
import { useModal } from './contexts/ModalContext';
import { infoPages } from './data/infoPages';
import { lazy, useEffect, useState } from 'react';

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
        path: '/bokningshantering/:slug',
        element: <RestaurantAcceptancePage />,
      },
      ...infoPages.map(({ path, component: Comp }) => ({
        path,
        element: <Comp />,
      })),
    ],
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
  return <RouterProvider router={router} />;
}
