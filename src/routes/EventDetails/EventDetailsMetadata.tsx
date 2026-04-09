import { Anchor, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { generateRestaurantSlug, slugify } from '../../utils/slugify';

type EventDetailsMetadataProps = {
  host: {
    name?: string;
    alias?: string;
  } | null;
  restaurantName?: string;
  restaurantId: number;
  restaurantCity?: string;
};

export default function EventDetailsMetadata({
  host,
  restaurantName,
  restaurantId,
  restaurantCity,
}: EventDetailsMetadataProps) {
  return (
    <Text w='fit-content'>
      med{' '}
      <Anchor component={Link} to={`/profil/${host?.alias}`}>
        {host?.name}
      </Anchor>{' '}
      på{' '}
      <Anchor
        component={Link}
        to={`/restaurang/${generateRestaurantSlug(restaurantName ?? '', restaurantId)}`}>
        {restaurantName}
      </Anchor>{' '}
      i{' '}
      <Anchor component={Link} to={`/stad/${slugify(restaurantCity ?? '')}`}>
        {restaurantCity}
      </Anchor>
    </Text>
  );
}
