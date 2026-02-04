import { Modal } from '@mantine/core';

interface RegisteringModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function RegisteringModal({
  opened,
  onClose,
}: RegisteringModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title='Anmälan' centered>
      {/* Modal content */}
    </Modal>
  );
}
