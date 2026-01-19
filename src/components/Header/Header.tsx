import { ActionIcon, Burger, Group, UnstyledButton } from '@mantine/core';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import { BellIcon, SearchIcon, UserRound } from 'lucide-react';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function Header({ opened, onToggle, onClose }: HeaderProps) {
  return (
    <Group className='header' h='100%' w='100%' px='md' justify='space-between'>
      <Group gap='sm'>
        <Burger opened={opened} onClick={onToggle} size='sm' color='white' />

        <NavLink to='/' onClick={onClose}>
          <UnstyledButton className='logo'>DinnerWise</UnstyledButton>
        </NavLink>
      </Group>

      <Group gap='md'>
        <ActionIcon
          component={NavLink}
          to='/sokresultat'
          variant='subtle'
          color='white'
          size='md'>
          <SearchIcon size={20} />
        </ActionIcon>
        <ActionIcon
          component={NavLink}
          to='/'
          variant='subtle'
          color='white'
          size='md'>
          <BellIcon size={20} />
        </ActionIcon>
        <ActionIcon
          component={NavLink}
          to='/profil/:id'
          variant='subtle'
          color='white'
          size='md'>
          <UserRound size={20} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
