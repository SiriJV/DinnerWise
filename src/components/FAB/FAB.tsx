import { Button } from '@mantine/core';
import { Plus } from 'lucide-react';
import CreateEventModal from '../CreateEventModal';
import { useState } from 'react';

type FloatingActionButtonProps = {
  onClick?: () => void;
};

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <Button
        onClick={onClick || (() => setModalOpened(true))}
        radius="xl"
        size="lg"
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
        aria-label="Skapa"
      >
        <Plus size={28} />
      </Button>
      <CreateEventModal opened={modalOpened} onClose={() => setModalOpened(false)} />
    </>
  );
}