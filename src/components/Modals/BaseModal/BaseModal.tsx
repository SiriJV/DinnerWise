import { Modal, Text, Group, ActionIcon } from '@mantine/core';
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
            <ActionIcon
              variant='subtle'
              color='red'
              size='md'
              radius='sm'
              className='modal-help-icon'>
              <CircleHelp size={20} />
            </ActionIcon>
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
