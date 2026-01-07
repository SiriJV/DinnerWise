import { AppShell as MantineAppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from '../Header/Header';
import './AppShell.scss';
import NavBar from '../NavBar/NavBar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <MantineAppShell
        header={{ height: 60 }}
        padding='md'
        style={{ height: '100vh' }}>
        <MantineAppShell.Header className='appHeader'>
          <Header opened={opened} onToggle={toggle} />
        </MantineAppShell.Header>

        <MantineAppShell.Main>{children}</MantineAppShell.Main>
      </MantineAppShell>

      <NavBar opened={opened} onClose={close} />
    </>
  );
}
