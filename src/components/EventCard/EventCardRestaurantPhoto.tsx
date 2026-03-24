import { Image } from '@mantine/core';

interface EventCardRestaurantPhotoProps {
  pic_url?: string | null;
  restaurantName: string;
  height?: number;
}

export default function EventCardRestaurantPhoto({
  pic_url,
  restaurantName,
  height = 120,
}: EventCardRestaurantPhotoProps) {
  const fallbackUrl =
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop';

  return (
    <Image
      src={pic_url || fallbackUrl}
      alt={restaurantName}
      height={height}
      width='100%'
      fit='cover'
      style={{ display: 'block' }}
    />
  );
}
