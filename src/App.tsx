import '@mantine/core/styles.css';
import './App.scss';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import AppShell from './components/AppShell/AppShell';
import { navLinks, accordionItems } from './data/NavLinks';
import HomePage from './routes/HomePage/HomePage';
import CookiesPage from './routes/info pages/CookiesPage';
import EventDetails from './routes/EventDetails/EventDetails';
import RestaurangDetails from './routes/RestaurantDetails/RestaurantDetails';
import SearchPage from './routes/SearchPage';
import ProfilePage from './routes/ProfilePage/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MantineProvider theme={theme}>
        <AppShell />
      </MantineProvider>
    ),
    children: [
      { index: true, element: HomePage() },

      ...navLinks.map((link) => ({
        path: link.path,
        element: link.element,
      })),

      ...accordionItems.flatMap((item) =>
        item.panels.map((panel) => ({
          path: panel.path,
          element: panel.element,
        }))
      ),

      {
        path: '/sokresultat',
        element: <SearchPage />,
      },

      {
        path: '/cookies',
        element: <CookiesPage />,
      },

      {
        path: '/profil/:id',
        element: <ProfilePage />,
      },
      {
        path: '/event/:id',
        element: <EventDetails />,
      },

      {
        path: '/restaurang/:id',
        element: <RestaurangDetails />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
