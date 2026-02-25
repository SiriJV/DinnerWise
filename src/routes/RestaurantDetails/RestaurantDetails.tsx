import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
import { MapPin, ExternalLink } from 'lucide-react';
import EventCard from '../../components/EventCard/EventCard';
import type { EventType } from '../../types/EventType';
import { extractIdFromSlug } from '../../utils/slugify';
import { Carousel } from '@mantine/carousel';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const emblaApiRef = useRef<any>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const state = location.state as { id?: string } | undefined;
  const { slug } = useParams<{ slug: string }>();

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

        const eventsRes = await fetch(
          `http://localhost:3001/restaurants/${restaurantData.id}/events`,
        );
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadRestaurant();
  }, [slug, state]);

  // Parse TripAdvisor photos if available (alltid deklarera och parsa, även om restaurant är null)
  let photos: string[] = [];
  if (restaurant && restaurant.photos) {
    try {
      const parsed = JSON.parse(restaurant.photos);
      if (Array.isArray(parsed)) {
        photos = parsed;
      }
    } catch {}
  }

  // Enkel autoplay för karusellen
  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    setCurrentSlide(0); // starta alltid från första bilden när nya bilder laddas
    const max = Math.min(photos.length, 5);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % max);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length]);

  // Synka embla-carousel till rätt slide när currentSlide ändras
  useEffect(() => {
    if (
      emblaApiRef.current &&
      typeof emblaApiRef.current.scrollTo === 'function'
    ) {
      emblaApiRef.current.scrollTo(currentSlide);
    }
  }, [currentSlide]);

  if (loading) {
    return (
      <Text p='xl' ta='center' c='dimmed'>
        Laddar restaurang...
      </Text>
    );
  }

  if (error || !restaurant) {
    return (
      <Text p='xl' ta='center' c='red'>
        {error || 'Restaurang hittades inte'}
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
        <Box style={{ flex: 1, minWidth: '300px' }}>
          {photos.length > 1 ? (
            <Stack>
              <Carousel
                withIndicators
                height={250}
                slideSize='100%'
                styles={{ indicator: { background: '#333' } }}
                withControls={false}
                emblaOptions={{ loop: true }}
                getEmblaApi={(api) => {
                  emblaApiRef.current = api;
                }}
                onSlideChange={setCurrentSlide}>
                {photos.slice(0, 5).map((photo, idx) => (
                  <Carousel.Slide key={idx}>
                    <Image
                      src={photo}
                      className='restaurant-image'
                      height={250}
                      fit='cover'
                      bdrs='md'
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Stack>
          ) : (
            <Image
              src={
                photos[0] ||
                restaurant.cover_picture_url ||
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
              }
              className='restaurant-image'
              height={250}
              fit='cover'
              bdrs='md'
            />
          )}
        </Box>

        <Stack gap='xs' style={{ flex: 1, minWidth: '300px' }}>
          <Box bdrs='md' style={{ overflow: 'hidden' }}>
            {/* Google Maps iframe using address if lat/lng are missing */}
            {restaurant.latitude && restaurant.longitude ? (
              <iframe
                src={`https://maps.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&z=15&output=embed`}
                title='Google map'
                width='100%'
                height={250}
                style={{ border: 0, display: 'block' }}
                loading='lazy'
              />
            ) : restaurant.address_string || restaurant.city ? (
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  `${restaurant.address_string || ''} ${restaurant.city || ''}`.trim(),
                )}&z=15&output=embed`}
                title='Google map'
                width='100%'
                height={250}
                style={{ border: 0, display: 'block' }}
                loading='lazy'
              />
            ) : (
              <Text c='dimmed' p='md'>
                Ingen karta tillgänglig
              </Text>
            )}
          </Box>
          <Group gap='xs'>
            <MapPin size='16px' />
            <Text>
              {restaurant.address_string
                ? restaurant.address_string
                : 'Adress saknas'}
              {restaurant.city ? `, ${restaurant.city}` : ''}
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
                current_participants={
                  typeof event.current_participants === 'number'
                    ? event.current_participants
                    : parseInt(event.current_participants ?? '0', 10) || 0
                }
                max_participants={
                  typeof event.max_participants === 'number'
                    ? event.max_participants
                    : parseInt(event.max_participants ?? '8', 10) || 8
                }
                price={
                  typeof event.price === 'number'
                    ? event.price
                    : parseFloat(event.price ?? '0') || 0
                }
                date={new Date(event.date)}
                start_time={event.start_time}
                end_time={event.end_time}
                restaurant_id={event.restaurant_id}
                restaurant_name={event.restaurant_name}
                restaurant_address={
                  event.restaurant_address || restaurant?.address_string || ''
                }
              />
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}
