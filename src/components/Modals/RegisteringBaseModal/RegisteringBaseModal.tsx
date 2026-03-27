import { Modal, Text, Group, ActionIcon, Popover, Stack } from '@mantine/core';
import { CircleHelp } from 'lucide-react';
import './RegisteringBaseModal.scss';
import { APP_CONFIG } from '../../../config/appConfig';
import DemoWarningText from '../../DemoWarningText/DemoWarningText';

const HEADER_HEIGHT = 60;
const HEADER_OFFSET = 10;

interface RegisteringBaseModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isFull?: boolean;
  helpText?: React.ReactNode;
}

export default function RegisteringBaseModal({
  opened,
  onClose,
  title,
  children,
  isFull,
  helpText,
}: RegisteringBaseModalProps) {
  return (
    <Modal
      size='xl'
      opened={opened}
      onClose={onClose}
      centered
      closeButtonProps={{
        color: 'gray',
        size: 'md',
        radius: 'sm',
      }}
      title={
        <Group gap='md' wrap='nowrap' className='modal-title-group'>
          <Text fw={600}>{title}</Text>
          <Group gap={0} className='modal-icons-group'>
            <Popover
              width={300}
              position='bottom'
              withArrow
              shadow='md'
              zIndex={2000}>
              <Popover.Target>
                <ActionIcon
                  variant='subtle'
                  color='gray'
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
                  <DemoWarningText text='Informationen är endast exempel.' />
                  {helpText ? (
                    <Text size='sm'>{helpText}</Text>
                  ) : isFull ? (
                    <>
                      <Text size='sm'>
                        Eventet är fullt. Om du ställer dig på väntelistan blir
                        du kontaktad via e-post om en plats blir ledig. Du
                        behöver inte betala förrän du får en plats!
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text size='sm'>
                        Fyll i alla uppgifter och godkänn anmälningsvillkoren
                        innan du går vidare. Välj en betalningsmetod och klicka
                        dig vidare. Nu är du anmäld!
                      </Text>
                    </>
                  )}
                  <Text size='sm'>
                    Behöver du mer hjälp? Kontakta oss på{' '}
                    <Text span fw={600}>
                      {APP_CONFIG.supportEmail}{' '}
                    </Text>{' '}
                    eller ring oss på{' '}
                    <Text span fw={600}>
                      {APP_CONFIG.telephone}
                    </Text>
                    .
                  </Text>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>
      }
      styles={{
        content: {
          maxHeight: `calc(100vh - ${HEADER_HEIGHT + HEADER_OFFSET}px)`,
          display: 'flex',
          flexDirection: 'column',
        },
        header: {
          display: 'flex',
          alignItems: 'center',
        },
        title: {
          flex: 1,
          display: 'flex',
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px',
        },
      }}
      classNames={{
        body: 'modal-scrollable-body',
      }}
      zIndex={1000}
      withinPortal={true}>
      {children}
    </Modal>
  );
}
