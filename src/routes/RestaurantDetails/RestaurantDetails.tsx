import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Image,
  Group,
  Anchor,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { NavLink } from 'react-router-dom';
import {
  BookmarkIcon,
  ChevronRight,
  FlagIcon,
  MapPin,
  Share,
  Globe,
  ExternalLink,
} from 'lucide-react';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
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
  const { id } = useParams<{ id: string }>();
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

    if (id) loadRestaurant();
  }, [id]);

  if (loading) {
    return (
      <>
        <Breadcrumb />
        <Text p='xl' ta='center' c='dimmed'>
          Laddar restaurang...
        </Text>
      </>
    );
  }

  if (error || !restaurant) {
    return (
      <>
        <Breadcrumb />
        <Text p='xl' ta='center' c='red'>
          {error || 'Restaurang hittades inte'}
        </Text>
      </>
    );
  }

  return (
    <>
      <Breadcrumb />
      <Stack m='md' gap='xl'>
        <Stack gap={0}>
          <Text size='xl' fw={800}>
            {restaurant.name}
          </Text>
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
            <Text size='lg' fw={600}>
              Kommande event på {restaurant.name}
            </Text>
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
