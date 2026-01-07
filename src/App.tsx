import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import AppShell from './components/AppShell/AppShell';
import { navLinks, accordionItems } from './data/NavLinks';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MantineProvider theme={theme}>
        <AppShell />
      </MantineProvider>
    ),
    children: [
      { index: true, element: <div>Home</div> },

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
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
