import { AppShell as MantineAppShell, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useIsMobile } from '../../hooks/useResponsive';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import ScrollToTop from '../common/ScrollToTop';
import SearchBar from '../SearchBar/SearchBar';
import { useAccountSync } from '../../hooks/useAccountSync';
import Breadcrumb from '../common/Breadcrumb/Breadcrumb';
import BackToTopButton from '../common/BackToTopButton/BackToTopButton';
import { Suspense } from 'react';
import { HEADER_CONFIG } from '../../config/headerConfig';
import FloatingActionButton from '../common/FAB/FAB';

export default function AppShell() {
  // Sync the signed-in Clerk user into account_users on first visit
  useAccountSync();
  // { children }: { children: React.ReactNode }
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useIsMobile();
  const headerHeight = isMobile ? HEADER_CONFIG.MOBILE : HEADER_CONFIG.DESKTOP;

  return (
    <>
      <MantineAppShell
        header={{
          height: { base: HEADER_CONFIG.MOBILE, sm: HEADER_CONFIG.DESKTOP },
        }}
        padding='0'
        withBorder={false}>
        <MantineAppShell.Header bg='red' c='white' zIndex={300}>
          <Header opened={opened} onToggle={toggle} onClose={close} />
        </MantineAppShell.Header>

        <MantineAppShell.Main>
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Breadcrumb />

            <Box hiddenFrom='sm' px='md' pt='xs' pb='xs'>
              <SearchBar />
            </Box>
            <ScrollToTop />
            <BackToTopButton />
            <FloatingActionButton />
            <Suspense fallback={null}>
              <Box
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: `calc(100dvh - ${headerHeight}px)`,
                }}>
                <Outlet />
              </Box>
            </Suspense>
          </Box>
          <Footer />
        </MantineAppShell.Main>
      </MantineAppShell>

      <NavBar opened={opened} onClose={close} offset={headerHeight} />
    </>
  );
}
