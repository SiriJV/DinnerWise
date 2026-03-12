import { useEffect, useState } from 'react';
import { useLocation, useNavigationType, useParams } from 'react-router-dom';
import { Box, Stack, Text, Group, Anchor, Divider, Title } from '@mantine/core';
import { ExternalLink } from 'lucide-react';
import type { EventType } from '../../types/EventType';
import { extractIdFromSlug } from '../../utils/slugify';
import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';
import Map from '../../components/Map/Map';
import RestaurantPhotosCarousel from './RestaurantPhotosCarousel';

type Restaurant = {
  id: number;
  name: string;
  address_string: string;
  city: string;
  location_id: string; // TripAdvisor location ID
  postalcode?: string;
  latitude?: number;
  longitude?: number;
  phone_number?: string;
  website_url?: string;
  photos?: string; // JSON array of photos from TripAdvisor
  cover_picture_url?: string;
  description?: string;
};

export default function RestaurangDetails(): React.ReactNode {
  // const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const state = location.state as { id?: string } | undefined;
  const { slug } = useParams<{ slug: string }>();
  const navigationType = useNavigationType();

  useEffect(() => {
    async function loadRestaurant() {
      if (!state?.id && !slug) return;

      try {
        setLoading(true);
        let restaurantData;
        let restaurantId: number | undefined = undefined;
        if (state?.id && !isNaN(Number(state.id))) {
          restaurantId = Number(state.id);
        } else if (slug) {
          const extracted = extractIdFromSlug(slug);
          if (typeof extracted === 'number' && !isNaN(extracted)) {
            restaurantId = extracted;
          }
        }
        if (typeof restaurantId === 'number' && !isNaN(restaurantId)) {
          const res = await fetch(
            `http://localhost:3001/restaurants/${restaurantId}`,
          );
          if (!res.ok) throw new Error('Kunde inte hämta restaurang');
          restaurantData = await res.json();
        } else {
          throw new Error('Restaurang hittades inte');
        }

        setRestaurant(restaurantData);

        const eventsRes = await fetch(`http://localhost:3001/events`);
        const allEvents: EventType[] = await eventsRes.json();

        const restaurantEvents = allEvents.filter(
          (e) => e.restaurant_id === restaurantData.id,
        );

        setEvents(restaurantEvents);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadRestaurant();
  }, [slug, state]);

  if (error || !restaurant) {
    return (
      <Text p='xl' ta='center' c='red'>
        {error || 'Restaurang hittades inte'}
      </Text>
    );
  }

  if (loading) {
    return (
      <Text p='xl' ta='center' c='dimmed'>
        Laddar restaurang...
      </Text>
    );
  }

  return (
    <Stack m='md' gap='xl'>
      <Stack gap={0}>
        <Title order={2}>{restaurant.name}</Title>
        <Text c='dimmed'>
          {restaurant.address_string
            ? restaurant.address_string
            : 'Adress saknas'}
          {restaurant.city ? `, ${restaurant.city}` : ''}
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
        <RestaurantPhotosCarousel
          photos={(() => {
            if (typeof restaurant.photos === 'string') {
              try {
                const parsed = JSON.parse(restaurant.photos);
                if (Array.isArray(parsed)) return parsed;
              } catch {}
            }
            return [];
          })()}
          restaurant={restaurant}
        />

        <Stack gap='xs' style={{ flex: 1, minWidth: '300px' }}>
          <Map
            restaurant_address={restaurant.address_string}
            restaurant_city={restaurant.city}
          />
        </Stack>
      </Group>

      <Divider />

      {events.length > 0 && (
        <Stack gap='md'>
          <Title order={3}>Kommande event på {restaurant.name}</Title>
          <PaginatedEventGrid
            events={events}
            pageSize={9}
            paginationKey='restaurantdetailspage_activePage'
            navigationType={navigationType}
          />
        </Stack>
      )}
    </Stack>
  );
}
