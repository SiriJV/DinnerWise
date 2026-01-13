import { Burger, Group, Title, UnstyledButton } from '@mantine/core';
import './Header.scss';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function Header({ opened, onToggle, onClose }: HeaderProps) {
  return (
    <Group className='header' h='100%' px='md'>
      <Burger opened={opened} onClick={onToggle} size='sm' color='white' />
      <div>
        <NavLink to='/' onClick={onClose}>
          <UnstyledButton className='logo'>
            {' '}
            {/* <Title order={1}>DinnerWise</Title> */}
            DinnerWise
          </UnstyledButton>
        </NavLink>
      </div>
    </Group>
  );
}
