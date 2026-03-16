import { Alert, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { EventType } from '../../../types/EventType';
import './ModalEventInfo.scss';

type User = {
  id: number;
  name: string;
  alias: string;
};

interface ModalEventInfoProps {
  event: EventType;
  showPrice?: boolean;
}

export default function ModalEventInfo({
  event,
  showPrice = true,
}: ModalEventInfoProps) {
  const [host, setHost] = useState<User | null>(null);

  useEffect(() => {
    async function loadHost() {
      try {
        const res = await fetch('http://localhost:3001/users');
        const data: User[] = await res.json();

        // Deterministic host based on event ID (same as EventCard/EventDetails)
        const hostIndex = event.id % data.length;
        setHost(data[hostIndex]);
      } catch (err) {
        console.error('Failed to load host:', err);
      }
    }
    loadHost();
  }, [event.id]);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <Alert
      color='red'
      title={
        <Text size='lg' fw={600} pb='xs'>
          {event.title}
        </Text>
      }>
      <Text>
        <Text span fw={600}>
          Datum:{' '}
        </Text>
        {formattedDate}
      </Text>
      <Text>
        <Text span fw={600}>
          Värd:{' '}
        </Text>
        {host?.name || 'Laddar...'}
      </Text>
      <Text>
        <Text span fw={600}>
          Plats:{' '}
        </Text>
        {event.restaurant_name}
        {event.restaurant_address && `, ${event.restaurant_address}`}
        {event.restaurant_city && `, ${event.restaurant_city}`}
      </Text>
      <Text>
        <Text span fw={600}>
          Tid:{' '}
        </Text>
        {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}
      </Text>
      {showPrice && (
        <Text pt='lg'>
          <Text span fw={600}>
            Kostnad:{' '}
          </Text>
          {Math.floor(event.price)} kr
        </Text>
      )}{' '}
    </Alert>
  );
}
