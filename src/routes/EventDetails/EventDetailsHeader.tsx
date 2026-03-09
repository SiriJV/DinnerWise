import { Stack, Group, Title } from '@mantine/core';
import EventDetailsMetadata from './EventDetailsMetadata';
import EventSpotsBadge from '../../components/EventSpotsBadge/EventSpotsBadge';

type EventDetailsHeaderProps = {
  title: string;
  currentParticipants: number;
  maxParticipants: number;
  host: any;
  restaurantName?: string;
  restaurantId: number;
  restaurantCity?: string;
};

export default function EventDetailsHeader({
  title,
  currentParticipants,
  maxParticipants,
  host,
  restaurantName,
  restaurantId,
  restaurantCity,
}: EventDetailsHeaderProps) {
  return (
    <Stack gap='xs'>
      {/* Mobile layout */}
      <Stack gap='xs' hiddenFrom='md'>
        <EventSpotsBadge
          currentParticipants={currentParticipants}
          maxParticipants={maxParticipants}
          size='responsive'
        />

        <Title order={2}>{title}</Title>

        <EventDetailsMetadata
          host={host}
          restaurantName={restaurantName}
          restaurantId={restaurantId}
          restaurantCity={restaurantCity}
        />
      </Stack>

      {/* Desktop layout */}
      <Stack gap='xs' visibleFrom='md'>
        <Group justify='space-between' align='flex-start'>
          <Title order={2}>{title}</Title>

          <EventSpotsBadge
            currentParticipants={currentParticipants}
            maxParticipants={maxParticipants}
            size='responsive'
          />
        </Group>

        <EventDetailsMetadata
          host={host}
          restaurantName={restaurantName}
          restaurantId={restaurantId}
          restaurantCity={restaurantCity}
        />
      </Stack>
    </Stack>
  );
}
