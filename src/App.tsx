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
import DemoInfoModal from './components/Modals/DemoInfoModal/DemoInfoModal';
import { useModal } from './contexts/ModalContext';
import HomePage from './routes/HomePage/HomePage';
import CookiesPage from './routes/info pages/CookiesPage';
import EventDetails from './routes/EventDetails/EventDetails';
import RestaurangDetails from './routes/RestaurantDetails/RestaurantDetails';
import SearchPage from './routes/SearchPage';
import ProfilePage from './routes/ProfilePage/ProfilePage';
import CreateEventPage from './routes/CreateEventPage/CreateEventPage';
import SelectRestaurantPage from './routes/SelectRestaurantPage/SelectRestaurantPage';
import CategoryPage from './routes/CategoryPage/CategoryPage';
import TagPage from './routes/TagPage/TagPage';
import CityPage from './routes/CityPage/CityPage';
import { infoPages } from './data/infoPages';

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
        path: '/cookies',
        element: <CookiesPage />,
      },
      {
        path: '/profil/:alias',
        element: <ProfilePage />,
      },
      {
        path: '/event/:slug/',
        element: <EventDetails />,
      },
      {
        path: '/restaurang/:slug',
        element: <RestaurangDetails />,
      },
      {
        path: '/skapa-event',
        element: <CreateEventPage />,
      },
      {
        path: '/valj-restaurang',
        element: <SelectRestaurantPage />,
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
      ...infoPages.map(({ path, component: Comp }) => ({
        path,
        element: <Comp />,
      })),
    ],
  },
]);

import { useEffect, useState } from 'react';

function GlobalModals() {
  const { loginOpen, createOpen, closeModals } = useModal();
  const [demoOpen, setDemoOpen] = useState(true);

  // Visa bara första gången sidan laddas
  useEffect(() => {
    setDemoOpen(true);
  }, []);

  return (
    <>
      <DemoInfoModal opened={demoOpen} onClose={() => setDemoOpen(false)} />
      <LoginModal opened={loginOpen} onClose={closeModals} />
      <CreateAccountModal opened={createOpen} onClose={closeModals} />
    </>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
