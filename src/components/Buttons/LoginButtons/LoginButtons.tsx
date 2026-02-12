import { Stack } from '@mantine/core';
import BaseButton from '../BaseButton/BaseButton';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';
import LoginModal from '../../Modals/LoginModal/LoginModal';
import CreateAccountModal from '../../Modals/CreateAccountModal/CreateAccountModal';

type LoginButtonsProps = {
  onClose: () => void;
};

export default function LoginButtons({ onClose }: LoginButtonsProps) {
  const { isLoggedIn, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  if (isLoggedIn) {
    return (
      <Stack gap='xs' align='stretch' p='md'>
        <BaseButton
          variantType='primary'
          fullWidth
          onClick={logout}
          onClose={onClose}>
          Logga ut
        </BaseButton>
      </Stack>
    );
  }

  return (
    <>
      <Stack gap='xs' align='stretch' p='md'>
        <Stack gap='xs'>
          <BaseButton
            variantType='primary'
            fullWidth
            onClick={() => setLoginModalOpen(true)}
            onClose={onClose}>
            Logga in
          </BaseButton>

          <BaseButton
            variantType='secondary'
            fullWidth
            onClick={() => setCreateModalOpen(true)}
            onClose={onClose}>
            Skapa konto
          </BaseButton>
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
