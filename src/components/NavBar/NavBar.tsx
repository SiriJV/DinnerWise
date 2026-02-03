import { Stack, Text, UnstyledButton, Divider, Space } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { navLinks } from '../../data/NavLinks';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import LoginButtons from '../Buttons/LoginButtons/LoginButtons';
import './NavBar.scss';

interface NavBarProps {
  opened: boolean;
  onClose: () => void;
}

export default function NavBar({ opened, onClose }: NavBarProps) {
  if (!opened) return null;

  return (
    <>
      <div className='navOverlay' onClick={onClose} />

      <nav className='sideNav'>
        <Stack className='sideNavInner'>
          <Text fw={800} size='lg' px='md' pt='md'>
            Utforska efter kategori
          </Text>

          <Stack gap={15} px='md'>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={`/${link.path}`}
                className={({ isActive }) =>
                  `sideNavLink ${isActive ? 'active' : ''}`
                }
                onClick={onClose}>
                <UnstyledButton className='sideNavButton'>
                  {link.label}
                </UnstyledButton>
              </NavLink>
            ))}
          </Stack>

          {/* <Divider my='sm' /> */}
          <Space h='md' />

          <NavBarAccordion onClose={onClose} />

          <Space h='xs' />

          <LoginButtons onClose={onClose} />
        </Stack>
      </nav>
    </>
  );
}
