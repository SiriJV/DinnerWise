import { Modal, Text, Group, Stack } from '@mantine/core';
import { generateEventSlug } from '../../../utils/slugify';
import ShareLink from './ShareLink';
import ShareOnFacebook from './ShareOnFacebook';
import ShareOnInstagram from './ShareOnInstagram';
import ShareOnTwitter from './ShareOnTwitter';
import ShareByEmail from './ShareByEmail';
import { getHeaderHeight } from '../../../config/headerConfig';
import { useIsMobile } from '../../../hooks/useResponsive';

interface ShareModalProps {
  opened: boolean;
  onClose: () => void;
  eventUrl?: string;
  eventName?: string;
}

export default function ShareModal({
  opened,
  onClose,
  eventUrl = 'http://localhost:5173/event',
  eventName = '',
}: ShareModalProps) {
  // If eventUrl contains id, generate full url
  const eventId = eventUrl.match(/\d+$/)?.[0];
  const generatedUrl =
    eventName && eventId
      ? `http://localhost:5173/event/${generateEventSlug(eventName, Number(eventId))}`
      : eventUrl;

  const isMobile = useIsMobile();
  const headerHeight = getHeaderHeight(isMobile);

  return (
    <Modal
      size='sm'
      opened={opened}
      onClose={onClose}
      centered={false}
      yOffset={headerHeight + 20}
      title={
        <Group gap='md' wrap='nowrap'>
          <Text fw={600}>Dela event</Text>
        </Group>
      }
      styles={{
        content: {
          overflowY: 'auto',
        },
      }}>
      <Stack gap='md'>
        <ShareLink eventUrl={eventUrl} generatedUrl={generatedUrl} />
        <ShareByEmail eventName={eventName} generatedUrl={generatedUrl} />
        <ShareOnFacebook />
        <ShareOnInstagram />
        <ShareOnTwitter />
      </Stack>
    </Modal>
  );
}
