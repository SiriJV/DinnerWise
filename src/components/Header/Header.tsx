import {
  ActionIcon,
  Box,
  Burger,
  Group,
  Stack,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import NotificationsPopup from '../NotificationsPopup/NotificationsPopup';
import HeaderLoginButton from './HeaderLoginButton';
import { useAuth } from '../../contexts/AuthContext';
import { Brain, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { headerLinks } from '../../data/HeaderLinks';
import CreateEventModal from '../Modals/CreateEventModal/CreateEventModal';
import CreateEventLoginModal from '../Modals/CreateEventModal/CreateEventLoginModal';
import './Header.scss';
import { APP_CONFIG } from '../../config/appConfig';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
  onClose: () => void;
  onClickCreate?: () => void;
}

export default function Header({
  opened,
  onToggle,
  onClose,
  onClickCreate,
}: HeaderProps) {
  const { isLoggedIn } = useAuth();
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <Stack justify='space-between' p='md' h='100%'>
      {/* Top row */}
      <Group h='100%' justify='space-between' bg='red'>
        <Group gap='sm'>
          <Burger
            opened={opened}
            onClick={onToggle}
            size='sm'
            color='white'
            lineSize={2}
            aria-label='Toggle navigation'
          />

          <NavLink to='/' onClick={onClose} style={{ textDecoration: 'none' }}>
            <UnstyledButton
              c='white'
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}>
              <Group gap='xs' align='center'>
                <Brain color='white' />
                <Title
                  order={1}
                  size='xl'
                  c='white'
                  style={{ textDecoration: 'none' }}>
                  {APP_CONFIG.brandName}
                </Title>
              </Group>
            </UnstyledButton>
          </NavLink>
        </Group>

        <Box
          visibleFrom='sm'
          ml='lg'
          mr='lg'
          style={{
            flex: 1,
            minWidth: 0,
          }}>
          <SearchBar variant='fullwidth' />
        </Box>

        <Group gap='md'>
          <ActionIcon
            variant='subtle'
            color='white'
            size='md'
            onClick={onClickCreate || (() => setModalOpened(true))}>
            <PlusCircle size={20} />
          </ActionIcon>

          {isLoggedIn && <NotificationsPopup />}
          <HeaderLoginButton loggedIn={isLoggedIn} />
        </Group>
      </Group>

      {/* Links */}
      <Group gap='xl' visibleFrom='sm' style={{ marginTop: '8px' }}>
        {headerLinks.map((link, i) => (
          <NavLink
            key={link.path + link.label + i}
            to={link.path}
            className='headerLinks'>
            {link.label}
          </NavLink>
        ))}
      </Group>

      {/* Modals */}
      {isLoggedIn ? (
        <CreateEventModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
        />
      ) : (
        <CreateEventLoginModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
        />
      )}
    </Stack>
  );
}
