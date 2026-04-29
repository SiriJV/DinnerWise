import { ActionIcon, Group, Text } from '@mantine/core';
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../contexts/ModalContext';

interface HeaderLoginButtonProps {
  loggedIn: boolean;
}

export default function HeaderLoginButton({
  loggedIn,
}: HeaderLoginButtonProps) {
  const { openLogin } = useModal();
  const navigate = useNavigate();

  if (loggedIn) {
    return (
      <ActionIcon
        variant='subtle'
        color='white'
        size='md'
        onClick={() => navigate('/profil/anna_s')}>
        <UserRound size={20} />
      </ActionIcon>
    );
  }
  return (
    <ActionIcon
      variant='subtle'
      color='white'
      size='md'
      w='auto'
      p='5px'
      onClick={() => openLogin()}>
      <Group gap='xs'>
        <UserRound size={20} color='white' />
        <Text c='white'>Logga in</Text>
      </Group>
    </ActionIcon>
  );
}
