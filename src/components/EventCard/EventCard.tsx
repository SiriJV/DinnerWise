import { Card, Image, Text, Badge, Group, Avatar, Box } from '@mantine/core';
import { BookmarkIcon } from 'lucide-react';
import './EventCard.scss';

type EventCardProps = {
  title: string;
  image: string;
  host: string;
  hostImage: string;
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
  hostImage,
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
    <Card shadow='sm' radius='md' withBorder>
      <Card.Section pos='relative'>
        <Image src={image} h={160} alt={title} fit='cover' />

        <Avatar
          src={hostImage}
          alt={host}
          radius='xl'
          size={56}
          style={{
            position: 'absolute',
            bottom: -28,
            left: '1rem',
            border: '3px solid white',
            backgroundColor: 'white',
          }}
        />
      </Card.Section>

      <Box mt='xl' px='xs' pb='xs'>
        <Group justify='space-between'>
          <Text fw={800}>{title}</Text>
          <BookmarkIcon size={18} />
        </Group>

        <Text size='sm' mb='xs'>
          med {host}
        </Text>
        <Box className='eventInfo'>
          <Text size='xs' c='dimmed' fw={600}>
            {restaurant} · {address}
          </Text>
          <Text size='xs' c='dimmed' className='separator'>
            |
          </Text>
          <Text size='xs' c='dimmed'>
            {date} {timeRange}
          </Text>
        </Box>

        <Text size='sm' c='dimmed' className='eventDescription'>
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
            {isFull
              ? 'Fullt'
              : `${maxSpots - spots} av ${maxSpots} platser kvar`}
          </Badge>

          <Text fw={600}>{price} kr</Text>
        </Group>
      </Box>
    </Card>
  );
}
