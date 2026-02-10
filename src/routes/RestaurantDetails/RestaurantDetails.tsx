import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { extractIdFromSlug, generateRestaurantSlug } from '../../utils/slugify';
import {
  Box,
  Stack,
  Text,
  Image,
  Group,
  Anchor,
  SimpleGrid,
  Divider,
  Title,
} from '@mantine/core';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { MapPin, ExternalLink } from 'lucide-react';
import EventCard from '../../components/EventCard/EventCard';
import type { EventType } from '../../types/EventType';

type Restaurant = {
  id: number;
  name: string;
  address: string;
  city: string;
  phone_number?: string;
  website_url?: string;
};

export default function RestaurangDetails(): React.ReactNode {
  const { slug } = useParams<{ slug: string }>();
  const id = slug ? extractIdFromSlug(slug) : null;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const [restaurantRes, eventsRes] = await Promise.all([
          fetch(`http://localhost:3001/restaurants/${id}`),
          fetch(`http://localhost:3001/restaurants/${id}/events`),
        ]);

        if (!restaurantRes.ok) throw new Error('Kunde inte hämta restaurang');
        const restaurantData: Restaurant = await restaurantRes.json();

        // Validate that slug matches restaurant data
        const expectedSlug = generateRestaurantSlug(
          restaurantData.name,
          restaurantData.id,
        );
        if (slug !== expectedSlug) {
          setError('Restaurang hittades inte');
          setLoading(false);
          return;
        }

        setRestaurant(restaurantData);

        if (eventsRes.ok) {
          const eventsData: EventType[] = await eventsRes.json();
          setEvents(eventsData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadRestaurant();
    } else {
      setError('Ogiltigt restaurang-ID');
      setLoading(false);
    }
  }, [id, slug]);

  if (loading) {
    return (
      <>
        <Text p='xl' ta='center' c='dimmed'>
          Laddar restaurang...
        </Text>
      </>
    );
  }

  if (error || !restaurant) {
    return (
      <>
        <Text p='xl' ta='center' c='red'>
          {error || 'Restaurang hittades inte'}
        </Text>
      </>
    );
  }

  return (
    <>
      <Stack m='md' gap='xl'>
        <Stack gap={0}>
          <Title order={2}>{restaurant.name}</Title>
          <Text c='dimmed'>
            {restaurant.address}, {restaurant.city}
          </Text>
          {restaurant.website_url && (
            <Anchor
              href={restaurant.website_url}
              target='_blank'
              style={{ textDecoration: 'none' }}>
              <Group gap='xs' mt='xs'>
                <ExternalLink size={16} color='black' />
                <Text size='sm' c='dark'>
                  {restaurant.website_url.replace(/^https?:\/\/(www\.)?/, '')}
                </Text>
              </Group>
            </Anchor>
          )}
        </Stack>

        {restaurant.phone_number && (
          <Box>
            <Text fw={600} mb='xs'>
              Kontakt
            </Text>
            <Text size='sm'>Telefon: {restaurant.phone_number}</Text>
          </Box>
        )}

        <Group align='flex-start' gap='md' wrap='wrap'>
          <Box style={{ flex: 1, minWidth: '300px' }}>
            <Image
              src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
              className='restaurant-image'
              height={250}
              bdrs='md'
            />
          </Box>

          <Stack gap='xs' style={{ flex: 1, minWidth: '300px' }}>
            <Box bdrs='md' style={{ overflow: 'hidden' }}>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2076.3658!2d12.53667!3d57.92968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464ff2a8f0c5b7e7%3A0x5c8c5b8c5b8c5b8c!2sVed%20House%20Alings%C3%A5s!5e0!3m2!1ssv!2sse!4v1644262070010!5m2!1ssv!2sse'
                title='Google map'
                width='100%'
                height={250}
                style={{ border: 0, display: 'block' }}
                loading='lazy'
              />
            </Box>
            <Group gap='xs'>
              <MapPin size='16px' />
              <Text>
                {restaurant.address}, {restaurant.city}
              </Text>
            </Group>
          </Stack>
        </Group>

        <Divider />

        {events.length > 0 && (
          <Stack gap='md'>
            <Title order={3}>Kommande event på {restaurant.name}</Title>
            <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing='md'>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  current_participants={event.current_participants}
                  max_participants={event.max_participants}
                  price={event.price}
                  date={new Date(event.date)}
                  start_time={event.start_time}
                  end_time={event.end_time}
                  restaurant_id={event.restaurant_id}
                  restaurant_name={event.restaurant_name}
                  restaurant_address={event.restaurant_address}
                />
              ))}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </>
  );
}
