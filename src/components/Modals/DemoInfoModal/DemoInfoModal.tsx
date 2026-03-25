import { Text, Modal, Button } from '@mantine/core';
import { APP_CONFIG } from '../../../config/appConfig';

interface DemoInfoModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function DemoInfoModal({ opened, onClose }: DemoInfoModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      // title='Demo {APP_CONFIG.brandName}'
      withCloseButton={false}
      size='md'
      centered>
      <Text ta='center' mb='md'>
        Den här är en demoversion av {APP_CONFIG.brandName}. Ingenting du
        skriver in eller klickar på sparas. Inga mejladresser eller
        telefonnummer leder någonstans utan är bara exempel.
      </Text>
      <Text ta='center'>
        Du kan fritt utforska och testa alla funktioner utan att informationen
        används utanför denna session. När du laddar om webbläsaren kommer all
        data att raderas permanent.
      </Text>

      <Button
        fullWidth
        onClick={() => {
          onClose();
        }}
        mt='lg'>
        Jag förstår{' '}
      </Button>
    </Modal>
  );
}
