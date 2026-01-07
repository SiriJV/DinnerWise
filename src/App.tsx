import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from './components/AppShell/AppShell';

const theme = createTheme({
  primaryColor: 'red',
});

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
      { path: 'litteratur', element: <div>Litteratur och skrivande</div> },
      { path: 'musik', element: <div>Musik</div> },
      { path: 'natur', element: <div>Natur och friluftsliv</div> },
      { path: 'it', element: <div>IT och teknik</div> },
      { path: 'sprak', element: <div>Språk</div> },
      { path: 'konst', element: <div>Konst och kultur</div> },
      { path: 'sport', element: <div>Sport och träning</div> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
