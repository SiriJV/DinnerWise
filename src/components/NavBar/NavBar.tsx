import { UnstyledButton } from '@mantine/core';
import { navLinks } from '../../data/NavLinks';
import './NavBar.scss';
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
              <UnstyledButton
                key={link.to}
                className='control'
                onClick={onClose}>
                {link.label}
              </UnstyledButton>
            ))}
          </div>

          {/* <DemoAccordion />
          <RedButton /> */}
        </div>
      </nav>
    </>
  );
}
