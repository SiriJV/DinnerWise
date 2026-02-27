import { Text, Modal, Anchor } from '@mantine/core';
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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      size='md'
      centered>
      <Text ta='center' mb='md'>
        Du måste <Anchor onClick={openLogin}>logga in</Anchor> för att skapa ett
        event.
      </Text>

      <BaseButton
        variantType='primary'
        fullWidth
        onClick={() => {
          onClose();
        }}
        mt='lg'>
        Jag förstår
      </BaseButton>
    </Modal>
  );
}
