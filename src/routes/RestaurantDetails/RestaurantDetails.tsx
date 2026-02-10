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
import { fetchRestaurantById, fetchRestaurantEvents } from '../../api/restaurants';

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
      if (!id) return;

      try {
        const [restaurantData, eventsData] = await Promise.all([
          fetchRestaurantById(id),
          fetchRestaurantEvents(id),
        ]);

        if (!restaurantData) {
          setError('Restaurang hittades inte');
          setLoading(false);
          return;
        }

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
        setEvents(eventsData);
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
            <Image
              src='https://upload.wikimedia.org/wikipedia/commons/3/3e/GNOME_Maps_3.32_screenshot.png'
              h={250}
              bdrs='md'
              className='map-image'
            />
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
