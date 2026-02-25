import { Box, Burger, Group, Title, UnstyledButton } from '@mantine/core';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import NotificationsPopup from '../NotificationsPopup/NotificationsPopup';
import HeaderLoginButton from './HeaderLoginButton';
import { useAuth } from '../../contexts/AuthContext';
import { Brain } from 'lucide-react';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function Header({ opened, onToggle, onClose }: HeaderProps) {
  const { isLoggedIn } = useAuth();

  return (
    <Group className='header' h='100%' w='100%' px='md' justify='space-between'>
      <Group gap='sm'>
        <Burger
          opened={opened}
          onClick={onToggle}
          size='sm'
          color='white'
          lineSize={2}
          aria-label='Toggle navigation'
        />

        <NavLink to='/' onClick={onClose}>
          <UnstyledButton className='logo'>
            <Group gap='xs'>
              <Brain color='white' />
              <Title order={1} size='lg'>
                DinnerWise
              </Title>
            </Group>
          </UnstyledButton>
        </NavLink>
      </Group>
      <Group gap='md'>
        <Box visibleFrom='sm'>
          <SearchBar variant='expandable' />
        </Box>
        <NotificationsPopup />
        <HeaderLoginButton loggedIn={isLoggedIn} />
      </Group>
    </Group>
  );
}
