import '@mantine/core/styles.css';
import './App.scss';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import AppShell from './components/AppShell/AppShell';
import { AuthProvider } from './contexts/AuthContext';
import { accordionItems } from './data/AccordionItems';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <MantineProvider theme={theme}>
          <AppShell />
        </MantineProvider>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },

      ...accordionItems.flatMap((item) =>
        item.panels.map((panel) => ({
          path: panel.path,
          element: panel.element,
        })),
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
        path: '/profil/:alias',
        element: <ProfilePage />,
      },
      {
        path: '/event/:slug',
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
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
