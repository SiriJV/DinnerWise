import { UnstyledButton } from '@mantine/core';
import { navLinks } from '../../data/NavLinks';
import { NavLink } from 'react-router-dom';
import './NavBar.scss';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import LoginButtons from '../Buttons/LoginButtons/LoginButtons';
// import DemoAccordion from '../../Accordion';
// import RedButton from '../../RedButton';

interface NavBarProps {
  opened: boolean;
  onClose: () => void;
}

export default function NavBar({ opened, onClose }: NavBarProps) {
  if (!opened) return null;

  return (
    <>
      <div className='overlay' onClick={onClose} />

      <nav className='navbar'>
        <div className='navWrapper'>
          <h2>Utforska efter kategori</h2>

          <div className='navLinks'>
            {navLinks.map((link) => (
              <NavLink
                key={`/${link.path}`}
                to={`/${link.path}`}
                className={({ isActive }) =>
                  `navLink navBarLink ${isActive ? 'active navBarLink' : ''}`
                }
                onClick={onClose}>
                <UnstyledButton>{link.label}</UnstyledButton>
              </NavLink>
            ))}
          </div>

          <NavBarAccordion onClose={onClose} />
          <LoginButtons />
        </div>
      </nav>
    </>
  );
}
