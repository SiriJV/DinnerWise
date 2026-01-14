import { Card, Image, Text, Badge, Group } from '@mantine/core';
import { BookmarkIcon } from 'lucide-react';

type EventCardProps = {
  title: string;
  image: string;
  host: string;
  restaurant: string;
  address: string;
  startTime: Date;
  endTime: Date;
  price: number;
  spots: number;
  maxSpots: number;
  description: string;
  maxDescriptionLength?: number;
};
export default function EventCard({
  title,
  image,
  host,
  restaurant,
  address,
  startTime,
  endTime,
  price,
  spots,
  maxSpots,
  description,
  maxDescriptionLength = 120,
}: EventCardProps) {
  const isFull = spots >= maxSpots;

  const date = startTime.toLocaleDateString('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const start = startTime.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const end = endTime.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const timeRange = `${start}–${end}`;

  const shortDescription =
    description.length > maxDescriptionLength
      ? description.slice(0, maxDescriptionLength).trim() + '…'
      : description;

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section>
        <Image src={image} height={160} alt={title} fit='cover' />
      </Card.Section>

      <Group justify='space-between' mt='md'>
        <Text fw={800}>{title}</Text>
        <BookmarkIcon size={18} />
      </Group>

      <Text size='sm' mb='xs'>
        med {host}
      </Text>

      <Text size='xs' c='dimmed' fw={600}>
        {restaurant} · {address}
      </Text>

      <Text size='xs' c='dimmed' mb='xs'>
        {date} · {timeRange}
      </Text>

      <Text size='sm' c='dimmed'>
        {shortDescription}
      </Text>

      <Group justify='space-between' mt='sm'>
        <Badge
          variant='filled'
          style={{
            backgroundColor: isFull
              ? 'rgba(255, 204, 199, 1)'
              : 'rgba(216, 227, 222, 1)',
            color: isFull ? 'rgba(116, 39, 62, 1)' : 'rgba(36, 56, 33, 1)',
          }}>
          {isFull ? 'Fullt' : `${maxSpots - spots} av ${maxSpots} platser kvar`}
        </Badge>

        <Text fw={600}>{price} kr</Text>
      </Group>
    </Card>
  );
}
