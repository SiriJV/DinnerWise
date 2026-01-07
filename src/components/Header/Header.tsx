import { Burger, Group, UnstyledButton } from '@mantine/core';
import './Header.scss';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export default function Header({ opened, onToggle }: HeaderProps) {
  return (
    <Group className='header' h='100%' px='md'>
      <Burger opened={opened} onClick={onToggle} size='sm' color='white' />
      <div>
        <NavLink to='/'>
          <UnstyledButton className='logo'>DinnerWise</UnstyledButton>
        </NavLink>
      </div>
    </Group>
  );
}
