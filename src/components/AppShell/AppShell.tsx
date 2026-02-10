import { AppShell as MantineAppShell, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from '../Header/Header';
import './AppShell.scss';
import NavBar from '../NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import ScrollToTop from '../ScrollToTop';
import SearchBar from '../SearchBar/SearchBar';
import Breadcrumb from '../Breadcrumb/Breadcrumb';

export default function AppShell() {
  // { children }: { children: React.ReactNode }
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <MantineAppShell header={{ height: 60 }} padding='0' withBorder={false}>
        <MantineAppShell.Header className='appHeader'>
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
            <Outlet />
          </Box>
          <Footer />
        </MantineAppShell.Main>
      </MantineAppShell>

      <NavBar opened={opened} onClose={close} />
    </>
  );
}
