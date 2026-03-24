import { Text, Modal, Anchor, Group } from '@mantine/core';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
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
        <BaseButton
          variantType='secondary'
          onClick={() => {
            onClose();
          }}
          fullWidth>
          Jag förstår
        </BaseButton>
        <BaseButton variantType='primary' onClick={handleLogin} fullWidth>
          Logga in
        </BaseButton>
      </Group>
    </Modal>
  );
}
