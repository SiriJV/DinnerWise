import { Card, Badge, Box, Skeleton } from '@mantine/core';
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

// Skeleton placeholder for loading state
function EventCardSkeleton() {
  return (
    <Card
      className='eventCard'
      shadow='sm'
      radius='md'
      pb='0'
      withBorder
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 280,
      }}>
      <Card.Section>
        <Skeleton height={120} />
      </Card.Section>
      <Box mt='xl' px='sm' pb='xs' style={{ flex: 1 }}>
        <Skeleton height={20} width='80%' mb='sm' />
        <Skeleton height={14} width='60%' mb='xs' />
        <Skeleton height={14} width='40%' mb='md' />
        <Skeleton height={12} width='100%' mb='xs' />
        <Skeleton height={12} width='90%' />
      </Box>
    </Card>
  );
}

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
  const [restaurantLoaded, setRestaurantLoaded] = useState(false);
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const { isLoggedIn, user } = useAuth();

  const {
    host,
    participants,
    loading: usersLoading,
  } = useEventUsers(id, current_participants);
  const isHost = user && host && user.id === host.id;

  useEffect(() => {
    if (restaurant_id) {
      fetchRestaurantById(restaurant_id)
        .then(setRestaurant)
        .finally(() => setRestaurantLoaded(true));
    } else {
      setRestaurantLoaded(true);
    }
  }, [restaurant_id]);

  let restaurantPhoto: string | undefined = undefined;
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

  // Preload the image before showing the card
  useEffect(() => {
    if (!restaurantLoaded) return;

    const fallbackUrl =
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop';
    const urlToLoad = restaurantPhoto || fallbackUrl;

    const img = new window.Image();
    img.onload = () => setImagePreloaded(true);
    img.onerror = () => setImagePreloaded(true);
    img.src = urlToLoad;
  }, [restaurantLoaded, restaurantPhoto]);

  // Show skeleton until all data is ready
  const isReady = restaurantLoaded && !usersLoading && imagePreloaded;

  if (!isReady) {
    return <EventCardSkeleton />;
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
      style={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Card.Section pos='relative'>
        <EventCardRestaurantPhoto
          pic_url={restaurantPhoto}
          restaurantName={restaurant_name || 'Restaurangbild'}
        />

        {isLoggedIn && (
          <>
            {isHost ? (
              <Badge
                color='red'
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

      <Box
        mt='xl'
        px='0'
        pb='xs'
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
        <Box style={{ marginTop: 'auto' }}>
          <EventSpotsBadge
            currentParticipants={current_participants}
            maxParticipants={max_participants}
            className='eventCardSpotsBadge'
            size='sm'
          />
        </Box>
      </Box>
    </Card>
  );
}
