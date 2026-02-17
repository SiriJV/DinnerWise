import { Box, Text, TextInput, Grid, Flex, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import ModalEventInfo from '../ModalEventInfo/ModalEventInfo';
import ShareModal from '../ShareModal/ShareModal';
import { Share } from 'lucide-react';
import type { EventType } from '../../../types/EventType';
import { slugify } from '../../../utils/slugify';
import { fetchUsers, type User } from '../../../api/users';
import RegisteringBaseModal from '../RegisteringBaseModal/RegisteringBaseModal';

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenPayment: () => void;
  event?: EventType | null;
}

export default function ConfirmationModal({
  opened,
  onClose,
  onOpenPayment,
  event,
}: ConfirmationModalProps) {
  const [shareModalOpened, { open: openShareModal, close: closeShareModal }] =
    useDisclosure(false);
  const [host, setHost] = useState<User | null>(null);

  useEffect(() => {
    async function loadHost() {
      if (!event) return;

      try {
        const users = await fetchUsers();
        const hostIndex = event.id % users.length;
        setHost(users[hostIndex]);
      } catch (err) {
        console.error('Failed to load host:', err);
      }
    }
    loadHost();
  }, [event]);

  const hostFirstName = host?.name.split(' ')[0] || 'värden';

  return (
    <RegisteringBaseModal
      opened={opened}
      onClose={onClose}
      title='Bekräftelse'
      onBack={() => {
        onClose();
        onOpenPayment();
      }}>
      <Group gap='sm' mb='md'>
        <Text size='lg'>
          Du är anmäld till{' '}
          <Text span fw={600}>
            {event?.title || ''}
          </Text>{' '}
          med {host?.name || 'värden'}!
        </Text>
        <Text size='sm'>
          Hej och välkommen! Jag heter {hostFirstName} och är din värd för{' '}
          <Text span fw={600}>
            {event?.title}
          </Text>{' '}
          på{' '}
          <Text span fw={600}>
            {event?.restaurant_name}
          </Text>
          . Jag ser fram emot att träffa dig och ha en fantastisk kväll
          tillsammans. Vi ses där!
        </Text>
        <Text size='sm' fw={600}>
          Kvitto och bokningsdetaljer kommer på mejl.
        </Text>
      </Group>

      {event && (
        <Box mb='lg' mt='lg'>
          <ModalEventInfo event={event} showPrice={false} />
        </Box>
      )}

      <Box>
        <Text size='lg' fw={600} mb='xs'>
          Kontaktuppgifter till värden{' '}
        </Text>

        <Grid gutter='md'>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label='Telefonnummer'
              value='+46703123456'
              variant='filled'
              readOnly
              radius='xs'
              mb={{ base: 0, sm: 'md' }}
              styles={{
                input: {
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  cursor: 'default',
                  pointerEvents: 'none',
                },
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label='E-post'
              value={`${host?.name.toLowerCase().replace(/ /g, '.') || 'varden'}@email.se`}
              variant='filled'
              readOnly
              radius='xs'
              mb='md'
              styles={{
                input: {
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  cursor: 'default',
                  pointerEvents: 'none',
                },
              }}
            />{' '}
          </Grid.Col>
        </Grid>
      </Box>
      <Group mt='lg' gap='md' align='stretch'>
        <Flex
          px='md'
          className='action-icon-button'
          align='center'
          justify='center'
          onClick={openShareModal}
          style={{ cursor: 'pointer' }}>
          <Share size={22} />
        </Flex>
        <BaseButton
          variantType='primary'
          style={{ flex: 1 }}
          onClick={() => {
            onClose();
          }}>
          Gå tillbaka till event{' '}
        </BaseButton>
      </Group>
      <ShareModal
        opened={shareModalOpened}
        onClose={closeShareModal}
        eventUrl={
          event
            ? `https://dinnerwise.se/event/${slugify(event.title)}`
            : undefined
        }
      />
    </RegisteringBaseModal>
  );
}
