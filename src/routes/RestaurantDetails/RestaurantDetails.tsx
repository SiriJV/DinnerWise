import { useEffect, useState } from 'react';
import { useLocation, useNavigationType, useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Group,
  Anchor,
  Title,
  Container,
  SimpleGrid,
} from '@mantine/core';
import { ExternalLink } from 'lucide-react';
import type { EventType } from '../../types/EventType';
import { extractIdFromSlug } from '../../utils/slugify';
import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';
import Map from '../../components/Map/Map';
import RestaurantPhotosCarousel from './RestaurantPhotosCarousel';
import EventDetailsHeroImage from '../EventDetails/EventDetailsHeroImage';

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

  let restaurantPhoto = undefined;
  if (restaurant?.photos) {
    try {
      const arr = JSON.parse(restaurant.photos);
      if (Array.isArray(arr) && arr.length > 0) {
        restaurantPhoto = arr[0];
      }
    } catch (e) {
      // ignore
    }
  }

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
          bd='1px solid rgba(206, 212, 218, 1)'
          py='xl'
          px={{ base: 'md', sm: 'lg', lg: 'xl' }}
          mt={{ base: 'md', md: '-60px', lg: '-90px' }}
          style={{ zIndex: 2 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
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
                    w='fit-content'
                    style={{ textDecoration: 'none' }}>
                    <Group gap='xs' mt='xs'>
                      <ExternalLink size={16} color='rgba(211, 4, 59, 1)' />
                      <Text size='sm' c='rgba(211, 4, 59, 1)'>
                        {restaurant.website_url.replace(
                          /^https?:\/\/(www\.)?/,
                          '',
                        )}
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
            </Stack>
            <Map
              restaurant_address={restaurant.address_string}
              restaurant_city={restaurant.city}
            />
          </SimpleGrid>
          {/* Grid of up to 10 photos, 5 per row */}
          {(() => {
            let photosArr: string[] = [];
            if (typeof restaurant.photos === 'string') {
              try {
                const parsed = JSON.parse(restaurant.photos);
                if (Array.isArray(parsed)) photosArr = parsed;
              } catch {}
            }
            if (photosArr.length > 0) {
              return (
                <SimpleGrid
                  cols={{ base: 2, md: 5 }}
                  spacing='xs'
                  mb='md'
                  mt='lg'>
                  {photosArr.map((url, idx) => (
                    <Box
                      key={idx}
                      style={{
                        aspectRatio: '1/1',
                        overflow: 'hidden',
                        borderRadius: 8,
                        border: '1px solid #eee',
                      }}>
                      <img
                        src={url}
                        alt={`Restaurangbild ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              );
            }
            return null;
          })()}
          {/* <Group align='flex-start' gap='md' wrap='wrap' mt='lg'>
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
          </Group> */}
        </Container>
      </Box>
      {events.length > 0 && (
        <Stack m='md' gap='md'>
          <Title order={3}>
            Kommande event på {restaurant.name} ({events.length} event)
          </Title>
          <PaginatedEventGrid
            events={events}
            pageSize={9}
            paginationKey='restaurantdetailspage_activePage'
            navigationType={navigationType}
          />
        </Stack>
      )}
    </>
  );
}
