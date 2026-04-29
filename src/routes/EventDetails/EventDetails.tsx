import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSession } from '@clerk/clerk-react';
import { slugify, generateRestaurantSlug } from '../../utils/slugify';
import {
  Text,
  Image,
  Grid,
  Stack,
  Box,
  Group,
  Badge,
  Flex,
  Title,
  Pill,
  Alert,
} from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
import './EventDetails.scss';
import {
  BookmarkIcon,
  ChevronRight,
  FlagIcon,
  MapPin,
  Share,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import ParticipantAvatars from '../../components/ParticipantAvatars/ParticipantAvatars';
import RegisteringModal from '../../components/Modals/RegisteringModal/RegisteringModal';
import PaymentModal from '../../components/Modals/PaymentModal/PaymentModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal/ConfirmationModal';
import ShareModal from '../../components/Modals/ShareModal/ShareModal';
import WaitlistConfirmationModal from '../../components/Modals/WaitlistConfirmationModal/WaitlistConfirmationModal';
import type { EventType } from '../../types/EventType';
import { fetchUsers, type User } from '../../api/users';
import { reportEvent } from '../../api/events';
import { Container, SimpleGrid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import type { EventType } from '../../types/EventType';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import EventDetailsHeroImage from './EventDetailsHeroImage';
import useEventUsers from '../../hooks/useEventUsers';
import Map from '../../components/Map/Map';
import EventDetailsHeader from './EventDetailsHeader';
import EventModals from '../../components/Modals/EventModals/EventRegistrationModal';
import EventDescription from './EventDescription';
import EventInfoCards from './EventInfoCard';
import EventParticipantsAndHost from './EventParticipantsAndHost';
import EventActions from './EventActions';
import ReportModal from '../../components/Modals/ReportModal/ReportModal';

export default function EventDetails(): React.ReactNode {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const { session } = useSession();
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
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [category, setCategory] = useState<{ id: number; name: string } | null>(
    null,
  );
  const [restaurantPhoto, setRestaurantPhoto] = useState<string | undefined>(
    undefined,
  );
  const [registerOpened, registerHandlers] = useDisclosure(false);
  const [paymentOpened, paymentHandlers] = useDisclosure(false);
  const [confirmationOpened, confirmationHandlers] = useDisclosure(false);
  const [waitlistOpened, waitlistHandlers] = useDisclosure(false);
  const [shareOpened, shareHandlers] = useDisclosure(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const {
    reportEventOpen,
    reportEventReason,
    reportEventDescription,
    openReportEvent,
    closeReportEvent,
    setReportEventReason,
    setReportEventDescription,
  } = useModal();

  const { host, participants } = useEventUsers(
    event?.id || 0,
    event?.current_participants || 0,
  );

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

        // Set restaurantPhoto from state if available, otherwise fetch from restaurant
        if (state?.restaurantPhoto) {
          setRestaurantPhoto(state.restaurantPhoto);
        } else if (eventData.restaurant_id) {
          try {
            const restaurantRes = await fetch(
              `http://localhost:3001/restaurants/${eventData.restaurant_id}`,
            );
            if (restaurantRes.ok) {
              const restaurantData = await restaurantRes.json();
              if (restaurantData.photos) {
                try {
                  const photosArr = JSON.parse(restaurantData.photos);
                  if (Array.isArray(photosArr) && photosArr.length > 0) {
                    setRestaurantPhoto(photosArr[0]);
                  }
                } catch (e) {}
              }
            }
          } catch (err) {}
        }

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

  async function handleReport() {
    if (!event) {
      setReportMessage({
        type: 'error',
        message: 'Eventet kunde inte rapporteras',
      });
      return;
    }

    setReportLoading(true);
    setReportMessage(null);
    try {
      const token = session ? await session.getToken() : null;

      const result = await reportEvent(event.id, token);
      setReportMessage({
        type: 'success',
        message: result.message,
      });
      setTimeout(() => setReportMessage(null), 3000);
    } catch (err: any) {
      setReportMessage({
        type: 'error',
        message: err.message || 'Kunde inte rapportera eventet',
      });
    } finally {
      setReportLoading(false);
    }
  }

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

            <Stack gap='xs'>
              <Text fw={600}>Om värden {hostFirstName}</Text>
              <NavLink
                to={host ? `/profil/${host.alias}` : '/profil/'}
                style={{ textDecoration: 'none', color: 'inherit' }}>
                <Group gap='0' wrap='nowrap' className='host-row'>
                  <Image
                    src={
                      host?.profile_picture_url ||
                      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
                    }
                    w={{ base: 80, md: 100 }}
                    className='host-image'
                  />

                  <Group
                    p='md'
                    wrap='nowrap'
                    className='host-image-information'>
                    <Text className='host-text' lineClamp={4}>
                      {host?.bio || `Se mer`}
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
                    event.restaurant_name && event.restaurant_id
                      ? `/restaurang/${generateRestaurantSlug(event.restaurant_name, event.restaurant_id)}`
                      : `/restaurang/${event.restaurant_id}`
                  }
                  className='restaurant-image-box'
                  style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Image
                    src={
                      restaurantPhoto ||
                      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
                    }
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
                {/* Google Maps iframe using address if lat/lng are missing */}
                {event.restaurant_address && event.restaurant_city ? (
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${event.restaurant_address} ${event.restaurant_city}`.trim(),
                    )}&z=15&output=embed`}
                    title='Google map'
                    width='100%'
                    height={200}
                    style={{ border: 0, display: 'block', borderRadius: '8px' }}
                    loading='lazy'
                  />
                ) : (
                  <Text c='dimmed' p='md'>
                    Ingen karta tillgänglig
                  </Text>
                )}
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
                    {isFull ? 'Skriv upp dig på väntelista' : 'Anmäl dig här'}
                  </BaseButton>
                  {isLoggedIn && (
                    <Flex px='md' py='sm' className='action-icon-button'>
                      <BookmarkIcon size={22} />
                    </Flex>
                  )}
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

        <Flex
          gap='xs'
          mt='lg'
          p='md'
          style={{ 
            cursor: reportLoading ? 'not-allowed' : 'pointer',
            borderRadius: '8px',
            opacity: reportLoading ? 0.6 : 1,
          }}
          onClick={handleReport}
          title=''
          onMouseEnter={(e) => {
            if (!reportLoading) {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}>
          <FlagIcon className='report-event-icon' />
          <Text 
            className='report-event-text'>
            {reportLoading ? 'Rapporterar...' : 'Rapportera event'}
          </Text>
        </Flex>

        {reportMessage && (
          <Alert
            mt='md'
            color={reportMessage.type === 'success' ? 'green' : 'red'}
            icon={
              reportMessage.type === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )
            }
            withCloseButton
            onClose={() => setReportMessage(null)}>
            {reportMessage.message}
          </Alert>
        )}
      </Box>

      <EventModals
        event={event}
        register={{ opened: registerOpened, ...registerHandlers }}
        payment={{ opened: paymentOpened, ...paymentHandlers }}
        confirmation={{ opened: confirmationOpened, ...confirmationHandlers }}
        waitlist={{ opened: waitlistOpened, ...waitlistHandlers }}
        share={{ opened: shareOpened, ...shareHandlers }}
      />

      <ReportModal
        opened={reportEventOpen}
        onClose={closeReportEvent}
        title='Rapportera event'
        reasons={[
          'Vilseledande beskrivning',
          'Otrevligt eller olämpligt event',
          'Spam eller bedrägeri',
          'Felaktig plats eller tid',
          'Olämpligt innehåll',
          'Tekniska fel',
          'Annat (ange i beskrivning)',
        ]}
        reason={reportEventReason}
        onReasonChange={setReportEventReason}
        description={reportEventDescription}
        onDescriptionChange={setReportEventDescription}
      />
    </>
  );
}
