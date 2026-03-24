import { AppShell as MantineAppShell, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import ScrollToTop from '../ScrollToTop';
import SearchBar from '../SearchBar/SearchBar';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { Suspense } from 'react';

export default function AppShell() {
  // { children }: { children: React.ReactNode }
  const [opened, { toggle, close }] = useDisclosure(false);

  // Responsive header height: 100px desktop, 60px mobile
  const HEADER_HEIGHT = 120;
  const HEADER_HEIGHT_MOBILE = 80;

  return (
    <>
      <MantineAppShell
        header={{
          // height: HEADER_HEIGHT,
          height: { base: HEADER_HEIGHT_MOBILE, sm: HEADER_HEIGHT },
        }}
        padding='0'
        withBorder={false}>
        <MantineAppShell.Header bg='red' c='white' zIndex={300}>
          <Header opened={opened} onToggle={toggle} onClose={close} />
        </MantineAppShell.Header>

        <MantineAppShell.Main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Box style={{ flex: 1 }}>
            <Breadcrumb />

            <Box hiddenFrom='sm' px='md' pt='xs' pb='xs'>
              <SearchBar />
            </Box>
            <ScrollToTop />
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </Box>
          <Footer />
        </MantineAppShell.Main>
      </MantineAppShell>

      <NavBar
        opened={opened}
        onClose={close}
        offset={
          window.matchMedia('(max-width: 48em)').matches
            ? HEADER_HEIGHT_MOBILE
            : HEADER_HEIGHT
        }
      />
    </>
  );
}
