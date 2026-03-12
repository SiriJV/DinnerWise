import { Card, Badge, Box } from '@mantine/core';
import { useState, useEffect } from 'react';
import './EventCard.scss';
import { useNavigate } from 'react-router-dom';
import { generateEventSlug } from '../../utils/slugify';
import { fetchRestaurantById, type Restaurant } from '../../api/restaurants';
import { useAuth } from '../../contexts/AuthContext';
import EventSpotsBadge from '../EventSpotsBadge/EventSpotsBadge';
import EventCardInfo from './EventCardInfo';
import EventCardHostAvatar from './EventCardHostAvatar';
import BookmarkButton from '../BookmarkIcon/BookmarkIcon';
import useEventUsers from '../../hooks/useEventUsers';
import EventCardRestaurantPhoto from './EventCardRestaurantPhoto';

type EventCardProps = {
  id: number;
  title: string;
  description: string;
  current_participants: number;
  max_participants: number;
  price: number;
  date: Date;
  start_time: string;
  end_time: string;
  restaurant_id: number;
  restaurant_name?: string;
  restaurant_address?: string;
  restaurant_city?: string;
  maxDescriptionLength?: number;
  isHost?: boolean;
};

export default function EventCard({
  id,
  title,
  description,
  current_participants,
  max_participants,
  price,
  date,
  start_time,
  end_time,
  restaurant_id,
  restaurant_name,
  restaurant_address,
  restaurant_city,
  maxDescriptionLength = 100,
}: EventCardProps) {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const { isLoggedIn, user } = useAuth();

  const { host, participants } = useEventUsers(id, current_participants);
  const isHost = user && host && user.id === host.id;

  useEffect(() => {
    if (restaurant_id) {
      fetchRestaurantById(restaurant_id).then(setRestaurant);
    }
  }, [restaurant_id]);

  let restaurantPhoto = undefined;
  if (restaurant?.photos) {
    try {
      const arr = JSON.parse(restaurant.photos);
      if (Array.isArray(arr) && arr.length > 0) {
        restaurantPhoto = arr[0];
      }
    } catch (e) {
      // ignore
    }
  }

  const displayPrice = typeof price === 'string' ? parseFloat(price) : price;

  const formattedDate = date.toLocaleDateString('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const safeStart = typeof start_time === 'string' ? start_time : '';
  const safeEnd = typeof end_time === 'string' ? end_time : '';
  const start = safeStart.slice(0, 5);
  const end = safeEnd.slice(0, 5);
  const timeRange = `${start}–${end}`;

  const safeDescription = typeof description === 'string' ? description : '';
  const safeMaxLength =
    typeof maxDescriptionLength === 'number' && !isNaN(maxDescriptionLength)
      ? maxDescriptionLength
      : 100;
  const shortDescription =
    safeDescription.length > safeMaxLength
      ? safeDescription.slice(0, safeMaxLength).trim() + '…'
      : safeDescription;

  return (
    <Card
      className='eventCard'
      shadow='sm'
      radius='md'
      pb='0'
      withBorder
      onClick={() =>
        navigate(`/event/${generateEventSlug(title, id)}`, {
          state: { id, restaurantPhoto },
        })
      }
      style={{ cursor: 'pointer' }}>
      <Card.Section pos='relative'>
        <EventCardRestaurantPhoto
          pic_url={restaurantPhoto}
          restaurantName={restaurant_name || 'Restaurangbild'}
        />

        {isLoggedIn && (
          <>
            {isHost ? (
              <Badge
                color='rgba(211, 4, 59, 1)'
                variant='filled'
                size='sm'
                className='hostBadge'>
                Ditt event
              </Badge>
            ) : (
              <BookmarkButton eventId={id} variant='sm' />
            )}
          </>
        )}

        <EventCardHostAvatar pic_url={host?.profile_picture_url || ''} />
      </Card.Section>

      <Box mt='xl' px='0' pb='xs'>
        <EventCardInfo
          title={title}
          displayPrice={displayPrice}
          host={host}
          restaurant_name={restaurant_name}
          restaurant_address={restaurant_address}
          restaurant_city={restaurant_city}
          restaurant_id={restaurant_id}
          formattedDate={formattedDate}
          timeRange={timeRange}
          participants={participants}
          displayCurrentParticipants={current_participants}
          displayMaxSpots={max_participants}
          shortDescription={shortDescription}
        />
        <EventSpotsBadge
          currentParticipants={current_participants}
          maxParticipants={max_participants}
          className='eventCardSpotsBadge'
          size='sm'
        />
      </Box>
    </Card>
  );
}
