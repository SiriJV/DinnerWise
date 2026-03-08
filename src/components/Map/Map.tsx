import { Group, Stack, Text } from '@mantine/core';
import { MapPin } from 'lucide-react';

type MapProps = {
  restaurant_address?: string;
  restaurant_city?: string;
};

export default function Map({ restaurant_address, restaurant_city }: MapProps) {
  return (
    <Stack gap='0'>
      <iframe
        src={`https://maps.google.com/maps?q=${encodeURIComponent(
          `${restaurant_address} ${restaurant_city}`.trim(),
        )}&z=15&output=embed`}
        title='Google map'
        width='100%'
        height={220}
        style={{ border: 0, display: 'block', borderRadius: '12px' }}
        loading='lazy'
      />
      <Group gap='xs' mt='sm'>
        <MapPin size={16} />
        <Text size='sm' c='dimmed'>
          {restaurant_address || 'Adress saknas'}
        </Text>
      </Group>
    </Stack>
  );
}
