import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Text,
  Image,
  Grid,
  Stack,
  Box,
  Group,
  Badge,
  Flex,
  Divider,
} from '@mantine/core';
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
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import type { EventType } from '../../types/EventType';

export default function EventDetails(): React.ReactNode {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`http://localhost:3001/events/${id}`);
        if (!res.ok) throw new Error('Kunde inte hämta event');
        const data: EventType = await res.json();
        setEvent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadEvent();
  }, [id]);

  if (loading) {
    return (
      <>
        <Breadcrumb />
        <Text p='xl' ta='center' c='dimmed'>
          Laddar event...
        </Text>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Breadcrumb />
        <Text p='xl' ta='center' c='red'>
          {error || 'Event hittades inte'}
        </Text>
      </>
    );
  }

  const eventDate = new Date(event.date);
  const displayMaxSpots = 8;
  const remainingSpots = displayMaxSpots - event.current_participants;
  const isFull = remainingSpots <= 0;
  const isAlmostFull = remainingSpots > 0 && remainingSpots <= 2;

  return (
    <>
      <Breadcrumb />

      <Box m='md'>
        {/* Title and Badge - Outside Grid */}
        <Stack gap={0} mb='lg'>
          <Group justify='space-between'>
            <Text size='xl' fw={800}>
              {event.title}
            </Text>
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
              size='lg'>
              {isFull
                ? 'Fullt'
                : `${event.current_participants}/${displayMaxSpots} platser`}
            </Badge>
          </Group>
          <Text component={NavLink} to='/profil/:id'>
            med Anders Blom
          </Text>
        </Stack>

        <Text mb='xl'>{event.description}</Text>

        <Group gap='md' mb='xl' grow>
          <Box px='xs' py='xs' className='event-info'>
            <Stack align='center' gap='0'>
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
            <Stack align='center' gap='0'>
              <Text size='md'>Tid</Text>
              <Text size='md' fw={600}>
                {event.start_time.slice(0, 5)}-{event.end_time.slice(0, 5)}
              </Text>
            </Stack>
          </Box>

          <Box px='xs' py='xs' className='event-info'>
            <Stack align='center' gap='0'>
              <Text size='md'>Pris</Text>
              <Text size='md' fw={600}>
                {Math.floor(event.price)} kr
              </Text>
            </Stack>
          </Box>
        </Group>

        <Divider mb='md' />
        <Grid gutter='xl'>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap='xs'>
              <Text fw={600}>Om värden</Text>

              <Group gap='0' wrap='nowrap' className='host-row'>
                <Image
                  src='https://images.unsplash.com/photo-1560250097-0b93528c311a'
                  w={80}
                  className='host-image'
                />

                <Group p='md' wrap='nowrap' className='host-image-information'>
                  <Text
                    component={NavLink}
                    to='/profil/:id'
                    className='host-text'
                    pr='md'
                    pl='sm'>
                    Hej! Anders heter jag. Utbildad jurist med miljöfokus och
                    lång erfarenhet av hållbarhetsfrågor. Bor i Kinna,
                    småbarnspappa till Ylva och Melker. På min fritid spelar jag
                    golf, tränar på nya recept med hållbara råvaror, engagerar
                    mig i lokala miljöprojekt och deltar i föreläsningar om
                    hållbar utveckling. Jag hoppas vi ses på något framtida
                    event!
                  </Text>
                  <NavLink to='/profil/:id' className='host-chevron-link'>
                    <ChevronRight className='host-chevron' />
                  </NavLink>
                </Group>
              </Group>

              <Group
                maw={450}
                gap='xs'
                mt='xl'
                justify='flex-end'
                className='join-event-group'>
                <BaseButton
                  size='md'
                  className='join-event-button'
                  style={{ width: 'auto' }}>
                  Anmäl dig här
                </BaseButton>
                <Flex px='md' py='sm' className='action-icon-button'>
                  <BookmarkIcon size={22} />
                </Flex>
                <Flex px='md' py='sm' className='action-icon-button'>
                  <Share size={22} />
                </Flex>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap='lg'>
              <Stack gap='xs'>
                <Text fw={600}>Plats</Text>
                <Box
                  component={NavLink}
                  to={`/restaurang/${event.restaurant_id}`}
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
            </Stack>
          </Grid.Col>
        </Grid>
        <Group gap='xs' mt='lg'>
          <FlagIcon className='report-event-icon' />
          <Text className='report-event-text'>Rapportera event</Text>
        </Group>
      </Box>
    </>
  );
}
