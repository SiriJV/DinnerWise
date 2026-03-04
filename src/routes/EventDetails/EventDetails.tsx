import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { slugify } from '../../utils/slugify';
import {
  Text,
  Grid,
  Stack,
  Box,
  Group,
  Flex,
  Title,
  Container,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './EventDetails.scss';
import { FlagIcon, Share } from 'lucide-react';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import ParticipantAvatars from '../../components/ParticipantAvatars/ParticipantAvatars';
import RegisteringModal from '../../components/Modals/RegisteringModal/RegisteringModal';
import PaymentModal from '../../components/Modals/PaymentModal/PaymentModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal/ConfirmationModal';
import ShareModal from '../../components/Modals/ShareModal/ShareModal';
import WaitlistConfirmationModal from '../../components/Modals/WaitlistConfirmationModal/WaitlistConfirmationModal';
import type { EventType } from '../../types/EventType';
import { useAuth } from '../../contexts/AuthContext';
import EventDetailsHeroImage from './EventDetailsHeroImage';
import EventSpotsBadge from '../../components/EventSpotsBadge/EventSpotsBadge';
import useEventUsers from '../../hooks/useEventUsers';
import BookmarkButton from '../../components/BookmarkIcon/BookmarkIcon';
import EventDetailsInfoCard from './EventDetailsInfoCard';
import TagPill from '../../components/TagPill/TagPill';
import EventDetailsMetadata from './EventDetailsMetadata';
import Map from '../../components/Map/Map';
import EventDetailsHostCard from './EventDetailsHostCard';

export default function EventDetails(): React.ReactNode {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [
    paymentModalOpened,
    { open: openPaymentModal, close: closePaymentModal },
  ] = useDisclosure(false);
  const [
    confirmationModalOpened,
    { open: openConfirmationModal, close: closeConfirmationModal },
  ] = useDisclosure(false);
  const [shareModalOpened, { open: openShareModal, close: closeShareModal }] =
    useDisclosure(false);
  const [
    waitlistModalOpened,
    { open: openWaitlistModal, close: closeWaitlistModal },
  ] = useDisclosure(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  const { host, participants } = useEventUsers(
    event?.id || 0,
    event?.current_participants || 0,
  );

  let restaurantPhoto = undefined;
  const location = useLocation();
  const state = location.state as
    | { id?: string; restaurantPhoto?: string }
    | undefined;
  if (state?.restaurantPhoto) {
    restaurantPhoto = state.restaurantPhoto;
  }

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);

        if (!state?.id) {
          throw new Error('Event ID saknas');
        }

        const res = await fetch(`http://localhost:3001/events/${state.id}`);
        if (!res.ok) throw new Error('Kunde inte hämta event');
        const eventData = await res.json();

        setEvent(eventData);

        const tagsRes = await fetch(
          `http://localhost:3001/events/${state.id}/tags`,
        );
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setTags(tagsData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [state]);

  if (loading) {
    return (
      <>
        <Text p='xl' ta='center' c='dimmed'>
          Laddar event...
        </Text>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Text p='xl' ta='center' c='red'>
          {error || 'Event hittades inte'}
        </Text>
      </>
    );
  }

  const eventDate = new Date(event.date);
  const displayMaxSpots = event.max_participants;
  const remainingSpots = displayMaxSpots - event.current_participants;
  const isFull = remainingSpots <= 0;

  return (
    <>
      <Box
        p='md'
        style={{ maxWidth: '100vw', overflowX: 'hidden' }}
        pos='relative'>
        <EventDetailsHeroImage
          image={
            restaurantPhoto ||
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
          }
        />

        <Container
          fluid
          visibleFrom='md'
          pos='relative'
          w='75%'
          bg='white'
          bdrs='xs'
          bd='1px solid rgba(206, 212, 218, 1)'
          py='xl'
          px='xl'
          mt='-120px'
          style={{ zIndex: 2 }}>
          <Stack gap='xl'>
            <Stack gap='xs'>
              <Group justify='space-between' align='flex-start' wrap='wrap'>
                <Title order={2}>{event.title}</Title>
                <EventSpotsBadge
                  currentParticipants={event.current_participants}
                  maxParticipants={event.max_participants}
                  size='xl'
                />
              </Group>

              <EventDetailsMetadata
                host={host}
                restaurantName={event.restaurant_name}
                restaurantId={event.restaurant_id}
                restaurantCity={event.restaurant_city}
              />
            </Stack>

            <Grid gutter='xl'>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text mb='lg' size='md' lh={1.6}>
                  {event.description}
                </Text>

                {tags.length > 0 && (
                  <Group gap='sm' wrap='wrap'>
                    {tags.map((tag) => (
                      <TagPill key={tag.id} tagID={tag.id} title={tag.name} />
                    ))}
                  </Group>
                )}
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Group gap='md' grow align='stretch'>
                  <EventDetailsInfoCard
                    title='Datum'
                    content={eventDate.toLocaleDateString('sv-SE', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  />
                  <EventDetailsInfoCard
                    title='Tid'
                    content={`${event.start_time.slice(0, 5)}–${event.end_time.slice(0, 5)}`}
                  />
                  <EventDetailsInfoCard
                    title='Pris'
                    content={`${Math.floor(event.price)} kr`}
                  />
                </Group>
              </Grid.Col>
            </Grid>

            <Grid align='flex-start' gutter='xl'>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Map
                  restaurant_address={event.restaurant_address}
                  restaurant_city={event.restaurant_city}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap='xl'>
                  <Box>
                    <Text fw={600} mb='sm'>
                      Deltagare
                    </Text>
                    <ParticipantAvatars
                      participants={participants}
                      maxVisible={8}
                      size='lg'
                      currentParticipants={event.current_participants}
                      maxParticipants={displayMaxSpots}
                    />
                  </Box>

                  <Box>
                    <Text fw={600} mb='sm'>
                      Värden
                    </Text>
                    <EventDetailsHostCard host={host} />
                  </Box>
                </Stack>
              </Grid.Col>
            </Grid>

            <Grid gutter='xl' mt='xl' align='flex-end'>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Group gap='xs'>
                  <FlagIcon color='rgba(211, 4, 59, 1)' />
                  <Text size='sm' c='rgba(211, 4, 59, 1)'>
                    Rapportera event
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Group w='100%' align='stretch' gap='md'>
                  <BaseButton size='md' style={{ flex: 1 }} onClick={openModal}>
                    {isFull ? 'Skriv upp dig på väntelista' : 'Anmäl dig här'}
                  </BaseButton>

                  {isLoggedIn && (
                    <BookmarkButton eventId={event.id} variant='lg' />
                  )}

                  <Flex
                    px='md'
                    py='sm'
                    onClick={openShareModal}
                    bg='rgba(206, 212, 218, 1)'
                    bdrs='sm'
                    style={{ cursor: 'pointer' }}>
                    <Share size={22} />
                  </Flex>
                </Group>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </Box>

      <RegisteringModal
        opened={modalOpened}
        onClose={closeModal}
        onOpenPayment={openPaymentModal}
        onOpenWaitlist={openWaitlistModal}
        event={event}
      />
      <PaymentModal
        opened={paymentModalOpened}
        onClose={closePaymentModal}
        onOpenConfirmation={openConfirmationModal}
        onOpenRegistration={openModal}
        event={event}
      />
      <ConfirmationModal
        opened={confirmationModalOpened}
        onClose={closeConfirmationModal}
        onOpenPayment={openPaymentModal}
        event={event}
      />
      <ShareModal
        opened={shareModalOpened}
        onClose={closeShareModal}
        eventUrl={
          event
            ? `https://dinnerwise.se/event/${slugify(event.title)}`
            : undefined
        }
      />
      <WaitlistConfirmationModal
        opened={waitlistModalOpened}
        onClose={closeWaitlistModal}
        onOpenWaitlist={openModal}
        event={event}
      />
    </>
  );
}
