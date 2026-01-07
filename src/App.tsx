// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import './App.scss';
// import RootLayout from './layouts/RootLayout';
// import HomePage from './routes/HomePage';
// import SearchPage from './routes/SearchPage';

// // import EventDetailsPage from './routes/BookDetailsPage/BookDetailsPage';
// // import { BooksContextProvider } from './contexts/BooksContext';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <RootLayout />,
//     children: [
//       { index: true, element: <HomePage /> },
//       {
//         path: 'search',
//         element: <SearchPage />,
//       },
//       // {
//       //   path: 'event/:eventid',
//       //   element: <EventDetailsPage />,
//       // },
//     ],
//   },
// ]);

// export default function App() {
//   return <RouterProvider router={router} />;
// }

import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import AppShell from './components/AppShell/AppShell';

const theme = createTheme({ primaryColor: 'red' });

export default function App() {
  return (
    <MantineProvider theme={theme}>
      {/* <MobileNavbar>
        <div>Här syns innehållet i Main!</div>
      </MobileNavbar> */}
      <AppShell>
        <div>Här syns innehållet i Main!</div>
      </AppShell>
    </MantineProvider>
  );
}
