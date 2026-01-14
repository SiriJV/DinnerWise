import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import AppShell from './components/AppShell/AppShell';
import { navLinks, accordionItems } from './data/NavLinks';
import HomePage from './routes/HomePage/HomePage';
import CookiesPage from './routes/info pages/CookiesPage';

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
        path: '/cookies',
        element: <CookiesPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
