import { Button, Stack } from '@mantine/core';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';
import LoginModal from '../../Modals/LoginModal/LoginModal';
import CreateAccountModal from '../../Modals/CreateAccountModal/CreateAccountModal';
import { useModal } from '../../../contexts/ModalContext';

type LoginButtonsProps = {
  onClose: () => void;
};

export default function LoginButtons({ onClose }: LoginButtonsProps) {
  const { isLoggedIn, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { openLogin, openCreate } = useModal();

  if (isLoggedIn) {
    return (
      <Stack gap='xs' align='stretch'>
        <Button
          variant='filled'
          fullWidth
          onClick={() => {
            logout();
            onClose();
          }}>
          Logga ut
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack gap='xs' align='stretch'>
        <Stack gap='xs'>
          <Button
            variant='filled'
            fullWidth
            onClick={() => {
              openLogin();
              onClose();
            }}>
            Logga in
          </Button>

          <Button
            variant='outline'
            fullWidth
            onClick={() => {
              openCreate();
              onClose();
            }}>
            Skapa konto
          </Button>
        </Stack>
      </Stack>
      <LoginModal
        opened={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <CreateAccountModal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}
