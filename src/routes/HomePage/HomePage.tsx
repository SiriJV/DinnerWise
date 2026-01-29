import { useEffect, useState } from 'react';
import { Badge, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import {
  MapPin,
  BookOpenText,
  CreditCard,
  Calendar,
  ChevronDown,
} from 'lucide-react';

import EventCard from '../../components/EventCard/EventCard';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import HeroImage from '../../components/HeroImage/HeroImage';
import type { EventType } from '../../types/EventType';

import './HomePage.scss';

export default function HomePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('http://localhost:3001/events');
        if (!res.ok) throw new Error('Kunde inte hämta events');
        const data: EventType[] = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <>
      <HeroImage src='src/assets/3.jpg' alt='Hero Image' position='center' />

      <Stack p='md'>
        <ImageCarousel />
        <Divider mt='sm' mb='lg' />

        <Group>
          <Badge c='rgba(116,39,62,1)' bg='rgba(255,204,199,1)'>
            <Group gap='xs'>
              <MapPin size={18} />
              Borås
              <ChevronDown size={18} />
            </Group>
          </Badge>

          <Badge c='rgba(116,39,62,1)' bg='rgba(255,204,199,1)'>
            <Group gap='xs'>
              <BookOpenText size={18} />
              Ämne
              <ChevronDown size={18} />
            </Group>
          </Badge>

          <Badge c='rgba(116,39,62,1)' bg='rgba(255,204,199,1)'>
            <Group gap='xs'>
              <CreditCard size={18} />
              Pris
              <ChevronDown size={18} />
            </Group>
          </Badge>

          <Badge c='rgba(116,39,62,1)' bg='rgba(255,204,199,1)'>
            <Group gap='xs'>
              <Calendar size={18} />
              Datum
              <ChevronDown size={18} />
            </Group>
          </Badge>
        </Group>

        <Stack mt='xs'>
          <Text fw={600}>Sortera</Text>

          {loading ? (
            <Text p='md' ta='center' c='dimmed'>
              Laddar events…
            </Text>
          ) : error ? (
            <Text p='md' c='red' ta='center'>
              Ett fel uppstod: {error}
            </Text>
          ) : (
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
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Stack>
    </>
  );
}
