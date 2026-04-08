import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Text, Stack, Box, Container, SimpleGrid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { EventType } from '../../types/EventType';
import { useAuth } from '../../contexts/AuthContext';
import EventDetailsHeroImage from './EventDetailsHeroImage';
import useEventUsers from '../../hooks/useEventUsers';
import Map from '../../components/Map/Map';
import EventDetailsHeader from './EventDetailsHeader';
import EventModals from '../../components/Modals/EventModals/EventModals';
import EventDescription from './EventDescription';
import EventInfoCards from './EventInfoCard';
import EventParticipantsAndHost from './EventParticipantsAndHost';
import EventActions from './EventActions';

export default function EventDetails(): React.ReactNode {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [category, setCategory] = useState<{ id: number; name: string } | null>(
    null,
  );
  const [registerOpened, registerHandlers] = useDisclosure(false);
  const [paymentOpened, paymentHandlers] = useDisclosure(false);
  const [confirmationOpened, confirmationHandlers] = useDisclosure(false);
  const [waitlistOpened, waitlistHandlers] = useDisclosure(false);
  const [shareOpened, shareHandlers] = useDisclosure(false);
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

  // Extrahera event-id från URL-slug om state saknas
  let eventId: string | undefined = state?.id;
  if (!eventId) {
    const slugMatch = location.pathname.match(/event\/.+-(\d+)$/);
    if (slugMatch) {
      eventId = slugMatch[1];
    }
  }

  if (state?.restaurantPhoto) {
    restaurantPhoto = state.restaurantPhoto;
  }

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);

        if (!eventId) {
          throw new Error('Event ID saknas');
        }

        const res = await fetch(`http://localhost:3001/events/${eventId}`);
        if (!res.ok) throw new Error('Kunde inte hämta event');
        const eventData = await res.json();

        setEvent(eventData);

        const tagsRes = await fetch(
          `http://localhost:3001/events/${eventId}/tags`,
        );
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setTags(tagsData);
        }

        // Fetch category by category_id
        if (eventData.category_id) {
          const categoriesRes = await fetch(`http://localhost:3001/categories`);
          if (categoriesRes.ok) {
            const categoriesData = await categoriesRes.json();
            const foundCategory = categoriesData.find(
              (cat: { id: number; name: string }) =>
                cat.id === eventData.category_id,
            );
            if (foundCategory) {
              setCategory(foundCategory);
            }
          }
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
          pos='relative'
          w={{ base: '100%', sm: '90%', lg: '75%' }}
          bg='white'
          bdrs='xs'
          bd='1px solid gray.4'
          py='xl'
          px={{ base: 'md', sm: 'lg', lg: 'xl' }}
          mt={{ base: 'md', sm: '-60px', lg: '-90px' }}
          style={{ zIndex: 2 }}>
          <Stack gap='xl'>
            <EventDetailsHeader
              title={event.title}
              currentParticipants={event.current_participants}
              maxParticipants={event.max_participants}
              host={host}
              restaurantName={event.restaurant_name}
              restaurantId={event.restaurant_id}
              restaurantCity={event.restaurant_city}
            />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
              <EventDescription
                description={event.description}
                category={category}
                tags={tags}
              />

              <EventInfoCards
                eventDate={eventDate}
                startTime={event.start_time}
                endTime={event.end_time}
                price={event.price}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='xl' mt='xl'>
              <Map
                restaurant_address={event.restaurant_address}
                restaurant_city={event.restaurant_city}
              />

              <EventParticipantsAndHost
                participants={participants}
                host={host}
                maxParticipants={event.max_participants}
                currentParticipants={event.current_participants}
              />
            </SimpleGrid>

            <EventActions
              isFull={isFull}
              isLoggedIn={isLoggedIn}
              eventId={event.id}
              register={registerHandlers}
              share={shareHandlers}
            />
          </Stack>
        </Container>
      </Box>

      <EventModals
        event={event}
        register={{ opened: registerOpened, ...registerHandlers }}
        payment={{ opened: paymentOpened, ...paymentHandlers }}
        confirmation={{ opened: confirmationOpened, ...confirmationHandlers }}
        waitlist={{ opened: waitlistOpened, ...waitlistHandlers }}
        share={{ opened: shareOpened, ...shareHandlers }}
      />
    </>
  );
}
