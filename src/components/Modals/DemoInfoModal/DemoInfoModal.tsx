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
      size='lg'
      centered>
      <Text ta='center'>
        Den här webbsidan är en demoversion. Du kan fritt utforska och testa
        alla funktioner utan att informationen sparas eller används på något
        sätt utanför denna session. Du kan inte anmäla dig till något eller
        betala. När du laddar om webbläsaren kommer all data att raderas
        permanent.
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
