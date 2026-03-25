import { Text, Modal, Anchor, Group, Button } from '@mantine/core';
import { useModal } from '../../../contexts/ModalContext';

interface CreateEventLoginModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateEventLoginModal({
  opened,
  onClose,
}: CreateEventLoginModalProps) {
  const { openLogin } = useModal();

  const handleLogin = () => {
    onClose();
    openLogin('createEvent');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      size='md'
      centered>
      <Text ta='center' mb='md'>
        Du måste <Anchor onClick={handleLogin}>logga in</Anchor> för att skapa
        ett event.
      </Text>
      <Group grow mt='lg'>
        <Button
          variant='outline'
          onClick={() => {
            onClose();
          }}
          fullWidth>
          Jag förstår
        </Button>
        <Button onClick={handleLogin} fullWidth>
          Logga in
        </Button>
      </Group>
    </Modal>
  );
}
