import { AppShell as MantineAppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from '../Header/Header';
import './AppShell.scss';
import NavBar from '../NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';

export default function AppShell() {
  // { children }: { children: React.ReactNode }
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <MantineAppShell
        header={{ height: 60 }}
        padding='0'
        style={{ height: '100vh' }}
        withBorder={false}>
        <MantineAppShell.Header className='appHeader'>
          <Header opened={opened} onToggle={toggle} onClose={close} />
        </MantineAppShell.Header>

        <MantineAppShell.Main>
          <Outlet />
          <Footer />
        </MantineAppShell.Main>
      </MantineAppShell>

      <NavBar opened={opened} onClose={close} />
    </>
  );
}
