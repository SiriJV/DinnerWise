import { Stack } from '@mantine/core';
import BaseButton from '../BaseButton/BaseButton';
import { useAuth } from '../../../contexts/AuthContext';

type LoginButtonsProps = {
  onClose: () => void;
};

export default function LoginButtons({ onClose }: LoginButtonsProps) {
  const { isLoggedIn, login, logout } = useAuth();

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
    <Stack gap='xs' align='stretch' p='md'>
      <Stack gap='xs'>
        <BaseButton
          variantType='primary'
          fullWidth
          onClick={login}
          onClose={onClose}
          to='/logga-in'>
          Logga in
        </BaseButton>

        <BaseButton
          variantType='secondary'
          fullWidth
          onClick={login}
          onClose={onClose}
          to='/skapa-konto'>
          Skapa konto
        </BaseButton>
      </Stack>
    </Stack>
  );
}
