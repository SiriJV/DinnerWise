import { Image } from '@mantine/core';

interface EventCardRestaurantPhotoProps {
  pic_url: string;
  restaurantName: string;
}

export default function EventCardRestaurantPhoto({
  pic_url,
  restaurantName,
}: EventCardRestaurantPhotoProps) {
  return (
    <Image
      src={
        pic_url ||
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
      }
      h={140}
      alt={restaurantName}
      fit='cover'
    />
  );
}
