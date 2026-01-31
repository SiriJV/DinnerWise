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
      <Grid m='md' gutter='xl' mx='md'>
        <Grid.Col span={{ base: 12, md: 7 }}>
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
          <Text>{event.description}</Text>

          <Group
            gap='xs'
            wrap='nowrap'
            px='xs'
            py='xs'
            justify='center'
            mt='xl'>
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

          <Stack gap='xs' mt='xl'>
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
                  Hej! Anders heter jag. Utbildad jurist med miljöfokus och lång
                  erfarenhet av hållbarhetsfrågor. Bor i Kinna, småbarnspappa
                  till Ylva och Melker. På min fritid spelar jag golf, tränar på
                  nya recept med hållbara råvaror, engagerar mig i lokala
                  miljöprojekt och deltar i föreläsningar om hållbar utveckling.
                  Jag hoppas vi ses på något framtida event!
                </Text>
                <NavLink to='/profil/:id' className='host-chevron-link'>
                  <ChevronRight className='host-chevron' />
                </NavLink>
              </Group>
            </Group>
            <Group gap='xs' mt='xl'>
              <FlagIcon className='report-event-icon' />
              <Text className='report-event-text'>Rapportera event</Text>
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 5 }} className='event-second-column'>
          <Box
            component={NavLink}
            to={`/restaurang/${event.restaurant_id}`}
            className='restaurant-image-box'>
            <Image
              src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
              className='restaurant-image'
              height={140}
            />
            <Box p='md' className='restaurant-information'>
              <Group
                // pt='sm'
                wrap='nowrap'
                className='restaurant-image-information'
                justify='space-between'>
                <Text td='none' tt='none' size='sm' fw={600}>
                  {event.restaurant_name || 'Restaurang'}
                  {event.restaurant_address && `, ${event.restaurant_address}`}
                </Text>
                {/* <Text
                  component={NavLink}
                  to={`/restaurang/${event.restaurant_id}`}
                  td='none'
                  c='dark'
                  size='xs'
                  className='restaurant-text'>
                  Välkommen in till oss på{' '}
                  {event.restaurant_name || 'restaurangen'}. En fantastisk plats
                  med härlig atmosfär och god mat.
                </Text> */}

                <NavLink
                  to={`/restaurang/${event.restaurant_id}`}
                  className='restaurant-chevron-link'>
                  <ChevronRight className='restaurant-chevron' />
                </NavLink>
              </Group>
            </Box>
          </Box>
          <Stack gap='xs' mt='lg'>
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
          <Group gap='xs' mt='xl' wrap='nowrap' className='join-event-group'>
            <BaseButton size='lg' className='join-event-button'>
              Anmäl dig här
            </BaseButton>
            <Flex px='md' py='sm' className='action-icon-button'>
              <BookmarkIcon size={22} />
            </Flex>
            <Flex px='md' py='sm' className='action-icon-button'>
              <Share size={22} />
            </Flex>
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );
}
