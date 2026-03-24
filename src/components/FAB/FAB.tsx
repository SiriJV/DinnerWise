import { Button } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateEventLoginModal from '../Modals/CreateEventModal/CreateEventLoginModal';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';

type FloatingActionButtonProps = {
  onClick?: () => void;
};

export default function FloatingActionButton({
  onClick,
}: FloatingActionButtonProps) {
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const { isLoggedIn } = useAuth();
  const { openCreateEvent } = useModal();

  return (
    <>
      <Button
        onClick={
          onClick ||
          (() => (isLoggedIn ? openCreateEvent() : setLoginModalOpened(true)))
        }
        radius='xl'
        size='lg'
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          borderRadius: '50%',
          padding: 0,
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        aria-label='Skapa'>
        <Plus size={28} />
      </Button>

      <CreateEventLoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />
    </>
  );
}
