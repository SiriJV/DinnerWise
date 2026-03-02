import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Avatar,
  Box,
  Divider,
} from '@mantine/core';
import { BookmarkIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import './EventCard.scss';
import ParticipantAvatars from '../ParticipantAvatars/ParticipantAvatars';
import { NavLink } from 'react-router-dom';
import { fetchUsers, type User } from '../../api/users';
import { slugify, generateEventSlug } from '../../utils/slugify';
import { fetchRestaurantById, type Restaurant } from '../../api/restaurants';
import { useAuth } from '../../contexts/AuthContext';

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
  isHost = false,
}: EventCardProps) {
  const [host, setHost] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const { isLoggedIn, bookmarks, addBookmark, removeBookmark } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      const data = await fetchUsers();

      // Deterministic host based on event ID
      const hostIndex = id % data.length;
      setHost(data[hostIndex]);

      // Deterministic participants based on event ID and current_participants
      const numParticipants = Math.min(current_participants || 0, data.length);
      const participantsList: User[] = [];
      for (let i = 0; i < numParticipants; i++) {
        const participantIndex = (id * 7 + i * 13) % data.length;
        if (!participantsList.find((p) => p.id === data[participantIndex].id)) {
          participantsList.push(data[participantIndex]);
        }
      }
      setParticipants(participantsList);
    }
    loadUsers();
  }, [id, current_participants]);

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

  const displayMaxSpots = max_participants;
  const displayCurrentParticipants = current_participants || 0;
  const displayPrice = typeof price === 'string' ? parseFloat(price) : price;

  const remainingSpots = displayMaxSpots - displayCurrentParticipants;
  const isFull = remainingSpots <= 0;
  const isAlmostFull = remainingSpots > 0 && remainingSpots <= 2;

  const isBookmarked = bookmarks.includes(id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      removeBookmark(id);
    } else {
      addBookmark(id);
    }
  };

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
      component={NavLink}
      to={`/event/${generateEventSlug(title, id)}`}
      state={{ id, restaurantPhoto }}
      shadow='sm'
      radius='md'
      pb='0'
      withBorder>
      <Card.Section pos='relative'>
        <Image
          src={
            restaurantPhoto ||
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
          }
          h={140}
          alt={title}
          fit='cover'
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
              <Box
                className={`bookmarkButton ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={handleBookmarkClick}>
                <BookmarkIcon
                  size={18}
                  color='black'
                  fill={isBookmarked ? 'black' : 'none'}
                />
              </Box>
            )}
          </>
        )}

        <Avatar
          src={
            host?.profile_picture_url || ''

            // 'https://images.unsplash.com/photo-1560250097-0b93528c311a'
          }
          alt='Host'
          radius='xl'
          size={56}
          className='hostAvatar'
        />
      </Card.Section>

      <Box mt='xl' px='0' pb='xs'>
        <Group justify='space-between'>
          <Text fw={800}>{title}</Text>
          <Text fw={600} c='black' className='price'>
            {Math.floor(displayPrice)} kr
          </Text>
        </Group>

        <Text size='sm' mb='xs'>
          med{' '}
          <NavLink
            to={host ? `/profil/${host.alias}` : '/profil/'}
            className='unstyledNavLink'
            onClick={(e) => e.stopPropagation()}>
            {host?.name || 'Anders Blom'}
          </NavLink>
        </Text>

        <Box className='eventInfo' mb='xs'>
          <Text size='xs' c='dimmed' fw={600}>
            <NavLink
              to={`/restaurang/${slugify(restaurant_name)}${typeof restaurant_id !== 'undefined' ? '-' + restaurant_id : ''}`}
              className='unstyledNavLink'
              onClick={(e) => e.stopPropagation()}>
              {(() => {
                const maxLength = 30;
                if (!restaurant_name) return 'Restaurang';
                return restaurant_name.length > maxLength
                  ? restaurant_name.slice(0, maxLength).trim() + '…'
                  : restaurant_name;
              })()}
            </NavLink>{' '}
            ·{' '}
            {(() => {
              if (restaurant_city) return restaurant_city;

              if (restaurant_address) {
                const parts = restaurant_address
                  .split(',')
                  .map((s) => s.trim());

                const city =
                  parts
                    .slice(1)
                    .find(
                      (s) =>
                        isNaN(Number(s)) &&
                        s.length > 0 &&
                        !/^SE|Sverige|Sweden$/i.test(s),
                    ) || '';

                if (city) return city;
              }

              return 'Ort saknas';
            })()}
          </Text>

          <Divider orientation='vertical' size='sm' />

          <Group justify='space-between' wrap='nowrap' style={{ flex: 1 }}>
            <Text size='xs' c='dimmed'>
              {formattedDate} {timeRange}
            </Text>
            <Box hiddenFrom='sm' style={{ flexShrink: 0 }}>
              <ParticipantAvatars
                participants={participants}
                maxVisible={3}
                size='sm'
                currentParticipants={displayCurrentParticipants}
                maxParticipants={displayMaxSpots}
              />
            </Box>
          </Group>
        </Box>

        <Group justify='space-between' visibleFrom='sm' w='100%' wrap='nowrap'>
          <Text size='sm' c='dimmed' className='eventDescription'>
            {shortDescription}
          </Text>

          <Box style={{ flexShrink: 0 }}>
            <ParticipantAvatars
              participants={participants}
              maxVisible={3}
              size='sm'
              currentParticipants={displayCurrentParticipants}
              maxParticipants={displayMaxSpots}
            />
          </Box>
        </Group>

        <Badge
          className='spotsBadge'
          variant='filled'
          style={{
            backgroundColor: isFull
              ? 'rgba(255, 204, 199, 1)'
              : isAlmostFull
                ? 'rgba(255, 238, 186, 1)'
                : 'rgba(216, 227, 222, 1)',

            color: isFull
              ? 'rgba(116, 39, 62, 1)'
              : isAlmostFull
                ? 'rgba(120, 90, 10, 1)'
                : 'rgba(36, 56, 33, 1)',
          }}>
          {isFull
            ? 'Fullt'
            : `${remainingSpots} ${remainingSpots === 1 ? 'plats' : 'platser'} kvar`}
        </Badge>
      </Box>
    </Card>
  );
}
