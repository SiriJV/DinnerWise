import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  extractIdFromSlug,
  generateEventSlug,
  generateRestaurantSlug,
} from '../../utils/slugify';
import {
  Text,
  Image,
  Grid,
  Stack,
  Box,
  Group,
  Badge,
  Flex,
  Avatar,
  Tooltip,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './EventDetails.scss';
import {
  BookmarkIcon,
  ChevronRight,
  FlagIcon,
  MapPin,
  Share,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import ParticipantAvatars from '../../components/ParticipantAvatars/ParticipantAvatars';
import RegisteringModal from '../../components/Modals/RegisteringModal/RegisteringModal';
import PaymentModal from '../../components/Modals/PaymentModal/PaymentModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal/ConfirmationModal';
import ShareModal from '../../components/Modals/ShareModal/ShareModal';
import type { EventType } from '../../types/EventType';

type User = {
  id: number;
  name: string;
  alias: string;
  bio: string;
  profile_picture_url?: string;
};

export default function EventDetails(): React.ReactNode {
  const { slug } = useParams<{ slug: string }>();
  const id = slug ? extractIdFromSlug(slug) : null;
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [host, setHost] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
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
  const [error, setError] = useState<string | null>(null);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      if (!id || !event) return;

      try {
        const res = await fetch('http://localhost:3001/users');
        const data: User[] = await res.json();
        setUsers(data);

        // Deterministic host based on event ID
        const hostIndex = id % data.length;
        setHost(data[hostIndex]);

        // Deterministic participants based on event ID and current_participants
        const numParticipants = Math.min(
          event.current_participants || 0,
          data.length,
        );
        const participantsList: User[] = [];
        for (let i = 0; i < numParticipants; i++) {
          const participantIndex = (id * 7 + i * 13) % data.length;
          if (
            !participantsList.find((p) => p.id === data[participantIndex].id)
          ) {
            participantsList.push(data[participantIndex]);
          }
        }
        setParticipants(participantsList);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    }
    loadUsers();
  }, [id, event]);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`http://localhost:3001/events/${id}`);
        if (!res.ok) throw new Error('Kunde inte hämta event');
        const data: EventType = await res.json();

        // Validate that slug matches event data
        const expectedSlug = generateEventSlug(data.title, data.id);
        if (slug !== expectedSlug) {
          setError('Event hittades inte');
          setLoading(false);
          return;
        }

        setEvent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadEvent();
    } else {
      setError('Ogiltigt event-ID');
      setLoading(false);
    }
  }, [id, slug]);

  useEffect(() => {
    let timeoutId: number;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer) {
          const footerRect = footer.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          // Add buffer zone to make transition smoother
          setIsNearFooter(footerRect.top < windowHeight + 80);
        }
      }, 16);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
  const isAlmostFull = remainingSpots > 0 && remainingSpots <= 2;

  return (
    <>
      <Box p='md' style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
        <Stack gap={0} mb='lg'>
          <Group justify='space-between' align='flex-start' wrap='wrap-reverse'>
            <Title order={2}>{event.title}</Title>
            <Badge
              bg={
                isFull
                  ? 'rgba(255, 204, 199, 1)'
                  : isAlmostFull
                    ? 'rgba(255, 238, 186, 1)'
                    : 'rgba(216, 227, 222, 1)'
              }
              c={
                isFull
                  ? 'rgba(116, 39, 62, 1)'
                  : isAlmostFull
                    ? 'rgba(120, 90, 10, 1)'
                    : 'rgba(36, 56, 33, 1)'
              }
              size='xl'>
              {isFull
                ? 'Fullt'
                : `${event.current_participants} anmälda, ${remainingSpots} ${remainingSpots === 1 ? 'plats' : 'platser'} kvar`}
            </Badge>
          </Group>
          <Text
            component={NavLink}
            to={host ? `/profil/${host.alias}` : '/profil/'}
            w='fit-content'>
            med{' '}
            <Text span className='host-name-text'>
              {host?.name || 'Anders Blom'}
            </Text>
          </Text>
        </Stack>

        <Text mb='xl'>{event.description}</Text>

        <Grid gutter='xl'>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Text fw={600}>Information</Text>
              <Group gap='md' mb='xl' grow>
                <Box px='xs' py='xs' className='event-info'>
                  <Stack align='center' gap='0' pt='xs' pb='xs'>
                    <Text size='md'>Datum</Text>
                    <Text size='md' fw={600}>
                      {eventDate.toLocaleDateString('sv-SE', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                  </Stack>
                </Box>

                <Box px='xs' py='xs' className='event-info'>
                  <Stack align='center' gap='0' pt='xs' pb='xs'>
                    <Text size='md'>Tid</Text>
                    <Text size='md' fw={600}>
                      {event.start_time.slice(0, 5)}-
                      {event.end_time.slice(0, 5)}
                    </Text>
                  </Stack>
                </Box>

                <Box px='xs' py='xs' className='event-info'>
                  <Stack align='center' gap='0' pt='xs' pb='xs'>
                    <Text size='md'>Pris</Text>
                    <Text size='md' fw={600}>
                      {Math.floor(event.price)} kr
                    </Text>
                  </Stack>
                </Box>
              </Group>
            </Stack>

            <Stack gap='xs'>
              <Text fw={600}>Om värden</Text>
              <NavLink
                to={host ? `/profil/${host.alias}` : '/profil/'}
                style={{ textDecoration: 'none', color: 'inherit' }}>
                <Group gap='0' wrap='nowrap' className='host-row'>
                  <Image
                    src={
                      host?.profile_picture_url ||
                      'https://placehold.co/200x200/png?text=Profilbild'
                      // 'https://images.unsplash.com/photo-1560250097-0b93528c311a'
                    }
                    w={{ base: 80, md: 100 }}
                    className='host-image'
                  />

                  <Group
                    p='md'
                    wrap='nowrap'
                    className='host-image-information'>
                    <Text className='host-text' lineClamp={4}>
                      {host?.bio ||
                        `Hej! ${host?.name || 'Anders'} heter jag. Utbildad jurist med miljöfokus och lång erfarenhet av hållbarhetsfrågor. Bor i Kinna, småbarnspappa till Ylva och Melker. På min fritid spelar jag golf, tränar på nya recept med hållbara råvaror, engagerar mig i lokala miljöprojekt och deltar i föreläsningar om hållbar utveckling. Jag hoppas vi ses på något framtida event!`}
                    </Text>
                    <ChevronRight className='host-chevron' />
                  </Group>
                </Group>
              </NavLink>

              <Box visibleFrom='sm' pt='xl' pb='xl'>
                <Text fw={600}>Deltagare</Text>
                <ParticipantAvatars
                  participants={participants}
                  maxVisible={100}
                  size='lg'
                  currentParticipants={event.current_participants}
                  maxParticipants={displayMaxSpots}
                />
              </Box>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }} className='event-second-column'>
            <Stack gap='lg'>
              <Stack gap='xs'>
                <Text fw={600}>Om platsen</Text>
                <Box
                  component={NavLink}
                  to={
                    event.restaurant_name
                      ? `/restaurang/${generateRestaurantSlug(event.restaurant_name, event.restaurant_id)}`
                      : `/restaurang/${event.restaurant_id}`
                  }
                  className='restaurant-image-box'
                  style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Image
                    src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
                    className='restaurant-image'
                    height={140}
                  />
                  <Box p='md' className='restaurant-information'>
                    <Group
                      wrap='nowrap'
                      className='restaurant-image-information'
                      justify='space-between'>
                      <Text td='none' tt='none' size='sm' fw={600}>
                        {event.restaurant_name || 'Restaurang'}
                        {event.restaurant_city && `, ${event.restaurant_city}`}
                      </Text>

                      <ChevronRight className='restaurant-chevron' />
                    </Group>
                  </Box>
                </Box>
              </Stack>

              <Stack gap='xs'>
                <Image
                  src='https://upload.wikimedia.org/wikipedia/commons/3/3e/GNOME_Maps_3.32_screenshot.png'
                  h={200}
                  bdrs='md'
                  className='map-image'
                />
                <Group gap='xs'>
                  <MapPin size='16px' />
                  <Text>{event.restaurant_address || 'Adress saknas'}</Text>
                </Group>
              </Stack>

              {/* Action Buttons */}
              <Box
                bg='white'
                p={isNearFooter ? 0 : 'md'}
                className={`sticky-action-buttons ${isNearFooter ? 'near-footer' : ''}`}>
                <Group gap='xs' className='join-event-group'>
                  <BaseButton
                    size='md'
                    className='join-event-button'
                    style={{ width: 'auto' }}
                    onClick={openModal}>
                    Anmäl dig här
                  </BaseButton>
                  <Flex px='md' py='sm' className='action-icon-button'>
                    <BookmarkIcon size={22} />
                  </Flex>
                  <Flex
                    px='md'
                    py='sm'
                    className='action-icon-button'
                    onClick={openShareModal}
                    style={{ cursor: 'pointer' }}>
                    <Share size={22} />
                  </Flex>
                </Group>
              </Box>
            </Stack>
          </Grid.Col>
        </Grid>

        <Group gap='xs' mt='lg'>
          <FlagIcon className='report-event-icon' />
          <Text className='report-event-text'>Rapportera event</Text>
        </Group>
      </Box>

      <RegisteringModal
        opened={modalOpened}
        onClose={closeModal}
        onOpenPayment={openPaymentModal}
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
            ? `https://dinnerwise.se/event/${generateEventSlug(event.title, event.id)}`
            : undefined
        }
      />
    </>
  );
}
