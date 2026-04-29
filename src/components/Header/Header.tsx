import {
  ActionIcon,
  Box,
  Burger,
  Group,
  Stack,
  Title,
  UnstyledButton,
  Text,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import NotificationsPopup from '../NotificationsPopup/NotificationsPopup';
import HeaderLoginButton from './HeaderLoginButton';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import { Brain, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { headerLinks } from '../../data/headerLinks';
import CreateEventLoginModal from '../Modals/CreateEventModal/CreateEventLoginModal';
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
  const { openCreateEvent } = useModal();
  const [loginModalOpened, setLoginModalOpened] = useState(false);

  return (
    <Stack justify='space-between' p='md' h='100%'>
      <Group h='100%' justify='space-between' bg='red'>
        <Group gap='sm' style={{ flex: '0 1 auto', minWidth: 0 }}>
          <Burger
            opened={opened}
            onClick={onToggle}
            size='sm'
            color='white'
            lineSize={2}
            aria-label='Toggle navigation'
          />

          <Link
            to='/'
            onClick={() => {
              onClose();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={() => import('../../routes/HomePage/HomePage')}
            style={{ textDecoration: 'none' }}>
            <UnstyledButton
              c='white'
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}>
              <Group gap='xs' align='center' style={{ minWidth: 0 }}>
                <Brain color='white' size={20} style={{ flexShrink: 0 }} />
                <Title
                  order={1}
                  size='xl'
                  c='white'
                  style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
                  hiddenFrom='sm'>
                  {APP_CONFIG.shortBrandName.toLocaleUpperCase()}
                </Title>
                <Title
                  order={1}
                  size='xl'
                  c='white'
                  style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
                  visibleFrom='sm'>
                  {APP_CONFIG.brandName.toLocaleUpperCase()}
                </Title>
              </Group>
            </UnstyledButton>
          </Link>
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
            onClick={
              onClickCreate ||
              (() =>
                isLoggedIn ? openCreateEvent() : setLoginModalOpened(true))
            }>
            <PlusCircle size={20} />
          </ActionIcon>

          {isLoggedIn && <NotificationsPopup />}
          <HeaderLoginButton loggedIn={isLoggedIn} />
        </Group>
      </Group>

      {/* Links */}
      <Group gap='xl' visibleFrom='sm' style={{ marginTop: '8px' }}>
        {headerLinks.map((link, i) => (
          <Link
            key={link.path + link.label + i}
            to={link.path}
            style={{ textDecoration: 'none' }}>
            <Text c='white' className='link-hover'>
              {link.label}
            </Text>
          </Link>
        ))}
      </Group>

      {/* Modals */}
      <CreateEventLoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />
    </Stack>
  );
}
