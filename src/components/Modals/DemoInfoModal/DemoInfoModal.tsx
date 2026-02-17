import { Text, Modal } from '@mantine/core';
import BaseButton from '../../Buttons/BaseButton/BaseButton';

interface DemoInfoModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function DemoInfoModal({ opened, onClose }: DemoInfoModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      // title='Demo DinnerWise'
      withCloseButton={false}
      size='md'
      centered>
      <Text ta='center' mb='md'>
        Den här är en demoversion av DinnerWise. Ingenting du skriver in eller
        klickar på sparas. När du laddar om webbläsaren kommer all data att
        raderas permanent.
      </Text>
      <Text ta='center'>
        Du kan fritt utforska och testa alla funktioner utan att informationen
        används utanför denna session.
      </Text>

      <BaseButton
        variantType='primary'
        fullWidth
        onClick={() => {
          onClose();
        }}
        mt='lg'>
        Jag förstår{' '}
      </BaseButton>
    </Modal>
  );
}
