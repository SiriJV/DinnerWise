import { Alert, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { EventType } from '../../../types/EventType';
import { getDeterministicHost } from '../../../utils/deterministicUsers';
import type { User } from '../../../api/users';
import { getApiEndpoint } from '../../../api/config';

interface ModalEventInfoProps {
  event: EventType;
  showPrice?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
}

export default function ModalEventInfo({
  event,
  showPrice = true,
  showTitle = true,
  showDescription = false,
}: ModalEventInfoProps) {
  const [host, setHost] = useState<User | null>(null);

  useEffect(() => {
    async function loadHost() {
      try {
        const res = await fetch(getApiEndpoint('/users'));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        // Validate response is an array
        if (Array.isArray(data)) {
          const hostUser = getDeterministicHost(event.id, data);
          setHost(hostUser);
        } else {
          console.warn('ModalEventInfo: users response is not an array', data);
          setHost(null);
        }
      } catch (err) {
        console.error('Failed to load host:', err);
        setHost(null);
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
        showTitle ? (
          <Text size='lg' fw={600} pb='xs'>
            {event.title}
          </Text>
        ) : (
          ''
        )
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
      {showDescription && (
        <Text pt='lg'>
          <Text span fw={600}>
            Beskrivning:{' '}
          </Text>
          {event.description}{' '}
        </Text>
      )}{' '}
    </Alert>
  );
}
