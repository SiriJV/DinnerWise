import { Box, Text, Flex, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import ModalEventInfo from '../ModalEventInfo/ModalEventInfo';
import ShareModal from '../ShareModal/ShareModal';
import { Share } from 'lucide-react';
import type { EventType } from '../../../types/EventType';
import { generateEventSlug } from '../../../utils/slugify';
import { fetchUsers, type User } from '../../../api/users';
import RegisteringBaseModal from '../RegisteringBaseModal/RegisteringBaseModal';

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
      onBack={() => {
        onClose();
        onOpenWaitlist();
      }}>
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
          {/* Hej och välkommen! Jag heter {hostFirstName} och är din värd för{' '}
          <Text span fw={600}>
            {event?.title}
          </Text>{' '}
          på{' '}
          <Text span fw={600}>
            {event?.restaurant_name}
          </Text>
          . Jag ser fram emot att träffa dig och ha en fantastisk kväll
          tillsammans. Vi ses där! */}
        </Text>
        {/* <Text size='sm' fw={600}>
          Kvitto och bokningsdetaljer kommer på mejl.
        </Text> */}
      </Group>

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
            ? `https://dinnerwise.se/event/${generateEventSlug(event.title, event.id)}`
            : undefined
        }
      />
    </RegisteringBaseModal>
  );
}
