import { Affix, ActionIcon } from '@mantine/core';
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
      <Affix position={{ bottom: 20, right: 20 }} zIndex={1000}>
        <ActionIcon
          onClick={
            onClick ||
            (() => (isLoggedIn ? openCreateEvent() : setLoginModalOpened(true)))
          }
          variant='filled'
          color='red'
          radius='xl'
          size={56}
          aria-label='Skapa'>
          <Plus size={28} />
        </ActionIcon>
      </Affix>

      <CreateEventLoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />
    </>
  );
}
