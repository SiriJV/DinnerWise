import { Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  return (
    <Text w='fit-content'>
      med{' '}
      <Text
        span
        c='dimmed'
        className='unstyledNavLink'
        onClick={(e) => {
          e.stopPropagation();
          navigate(host ? `/profil/${host.alias}` : '/profil/');
        }}
        style={{ cursor: 'pointer' }}>
        {host?.name || 'Anders Blom'}
      </Text>{' '}
      på{' '}
      <Text
        span
        c='dimmed'
        className='unstyledNavLink'
        onClick={(e) => {
          e.stopPropagation();
          navigate(
            restaurantName && restaurantId
              ? `/restaurang/${generateRestaurantSlug(
                  restaurantName,
                  restaurantId,
                )}`
              : `/restaurang/${restaurantId}`,
          );
        }}
        style={{ cursor: 'pointer' }}>
        {restaurantName}
      </Text>{' '}
      i{' '}
      <Text
        span
        c='dimmed'
        className='unstyledNavLink'
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/stad/${slugify(restaurantCity)}`);
        }}
        style={{ cursor: 'pointer' }}>
        {restaurantCity}
      </Text>
    </Text>
  );
}
