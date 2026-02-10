import {
  Modal,
  Text,
  Group,
  ActionIcon,
  Popover,
  Space,
  Stack,
} from '@mantine/core';
import { CircleHelp, ChevronLeft } from 'lucide-react';
import './BaseModal.scss';

interface BaseModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
}

export default function BaseModal({
  opened,
  onClose,
  title,
  children,
  onBack,
}: BaseModalProps) {
  return (
    <Modal
      size='lg'
      opened={opened}
      onClose={onClose}
      title={
        <Group gap='md' wrap='nowrap' className='modal-title-group'>
          <Text fw={600}>{title}</Text>
          <Group gap={0} className='modal-icons-group'>
            <Popover width={300} position='bottom' withArrow shadow='md'>
              <Popover.Target>
                <ActionIcon
                  variant='subtle'
                  color='red'
                  size='md'
                  radius='sm'
                  className='modal-help-icon'>
                  <CircleHelp size={20} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size='sm' fw={600} mb='xs'>
                  Hjälp{' '}
                </Text>
                <Stack gap='xs'>
                  <Text size='sm'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    sed nulla dapibus nisi molestie vehicula. Aenean viverra
                    mauris id diam convallis, et elementum quam aliquet.
                  </Text>
                  <Text size='sm'>
                    Behöver du mer hjälp? Kontakta oss på{' '}
                    <Text span fw={500}>
                      support@dinnerwise.se
                    </Text>{' '}
                    eller ring oss på{' '}
                    <Text span fw={500}>
                      08-123 456 78
                    </Text>
                    .
                  </Text>
                </Stack>
              </Popover.Dropdown>
            </Popover>
            {onBack && (
              <ActionIcon
                variant='subtle'
                color='gray'
                size='md'
                radius='sm'
                className='modal-back-icon'
                onClick={onBack}>
                <ChevronLeft size={20} />
              </ActionIcon>
            )}
          </Group>
        </Group>
      }
      centered
      styles={{
        header: {
          display: 'flex',
          alignItems: 'center',
        },
        title: {
          flex: 1,
          display: 'flex',
        },
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        },
      }}
      classNames={{
        body: 'modal-scrollable-body',
      }}>
      {children}
    </Modal>
  );
}
