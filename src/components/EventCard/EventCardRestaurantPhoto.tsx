import { Image, Loader, Center } from '@mantine/core';
import { useState } from 'react';

interface EventCardRestaurantPhotoProps {
  pic_url: string;
  restaurantName: string;
  height?: number;
}

export default function EventCardRestaurantPhoto({
  pic_url,
  restaurantName,
  height = 120,
}: EventCardRestaurantPhotoProps) {
  const [loaded, setLoaded] = useState(false);

  const fallbackUrl =
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop';

  return (
    <div
      style={{
        height,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
      {!loaded && (
        <Center
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}>
          <Loader size='sm' />
        </Center>
      )}

      <Image
        src={pic_url || fallbackUrl}
        alt={restaurantName}
        fit='cover'
        height={height}
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  );
}
