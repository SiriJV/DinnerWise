import { ActionIcon, Text } from '@mantine/core';
import { UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../contexts/ModalContext';

interface HeaderLoginButtonProps {
  loggedIn: boolean;
}

export default function HeaderLoginButton({
  loggedIn,
}: HeaderLoginButtonProps) {
  const { openLogin } = useModal();
  if (loggedIn) {
    return (
      <ActionIcon
        component={NavLink}
        to='/profil/anna_s'
        variant='subtle'
        color='white'
        size='md'>
        <UserRound size={20} />
      </ActionIcon>
    );
  }
  return (
    <button
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
      onClick={openLogin}>
      <Text c='white'>Logga in</Text>
    </button>
  );
}
