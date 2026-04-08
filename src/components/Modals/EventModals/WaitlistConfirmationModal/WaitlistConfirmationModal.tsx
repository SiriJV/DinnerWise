import { Box, Text, Flex, Group, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import ModalEventInfo from '../../ModalEventInfo/ModalEventInfo';
import ShareModal from '../../ShareModal/ShareModal';
import { Share } from 'lucide-react';
import type { EventType } from '../../../../types/EventType';
import { slugify } from '../../../../utils/slugify';
import { fetchUsers, type User } from '../../../../api/users';
import RegisteringBaseModal from '../../RegisteringBaseModal/RegisteringBaseModal';

interface WaitlistConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenWaitlist: () => void;
  event?: EventType | null;
}

export default function WaitlistConfirmationModal({
  opened,
  onClose,
  onOpenWaitlist,
  event,
}: WaitlistConfirmationModalProps) {
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

  return (
    <RegisteringBaseModal
      opened={opened}
      onClose={onClose}
      title='Bekräftelse väntelista'
      isFull={true}>
      <Group gap='sm' mb='md'>
        <Text size='lg'>
          Du är nu med på väntelista för{' '}
          <Text span fw={600}>
            {event?.title || ''}
          </Text>{' '}
          med {host?.name || 'värden'}!
        </Text>
        <Text size='sm'>
          Om en plats blir ledig kommer du att få ett mejl med instruktioner för
          hur du går vidare. Håll utkik i inkorgen!
        </Text>
      </Group>
      <Box
        style={{
          flex: '0 0 auto',
          borderTop: '1px solid var(--mantine-color-gray-2)',
          paddingTop: '16px',
        }}>
        <Group gap='12px' justify='space-between'>
          <Button
            variant='default'
            onClick={() => {
              onClose();
              onOpenWaitlist();
            }}>
            Tillbaka
          </Button>
          <Group gap='12px'>
            <Button variant='default' onClick={onClose}>
              Stäng
            </Button>
          </Group>
        </Group>
      </Box>
      {event && (
        <Box mb='lg' mt='lg'>
          <ModalEventInfo event={event} showPrice={false} />
        </Box>
      )}

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
        <Button
          style={{ flex: 1 }}
          onClick={() => {
            onClose();
          }}>
          Gå tillbaka till event{' '}
        </Button>
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
