import { Box, Text } from '@mantine/core';
import type { EventType } from '../../../types/EventType';
import './ModalEventInfo.scss';

interface ModalEventInfoProps {
  event: EventType;
  showPrice?: boolean;
}

export default function ModalEventInfo({
  event,
  showPrice = true,
}: ModalEventInfoProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <Box bg='gray.2' p='md' bdrs='sm' className='modal-event-info'>
      <Text size='lg' fw={600} pb='xs'>
        {event.title}
      </Text>
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
        Anders Blom
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
      )}
    </Box>
  );
}
