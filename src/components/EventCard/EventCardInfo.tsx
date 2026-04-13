import { Box, Group, Text, Divider } from '@mantine/core';
import ParticipantAvatars from '../ParticipantAvatars/ParticipantAvatars';
import { slugify } from '../../utils/slugify';
import type { User } from '../../api/users';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';

interface EventCardInfoProps {
  title: string;
  displayPrice: number;
  host?: User | null;
  restaurant_name?: string;
  restaurant_address?: string;
  restaurant_city?: string;
  restaurant_id?: number;
  formattedDate: string;
  timeRange: string;
  participants: User[];
  displayCurrentParticipants: number;
  displayMaxSpots: number;
  shortDescription: string;
}

export default function EventCardInfo({
  title,
  displayPrice,
  host,
  restaurant_name,
  restaurant_id,
  formattedDate,
  timeRange,
  participants,
  displayCurrentParticipants,
  displayMaxSpots,
  shortDescription,
}: EventCardInfoProps) {
  const navigate = useNavigate();

  const isLargeScreen = useMediaQuery('(min-width: 768px)');
  const maxRestaurantNameLength = isLargeScreen ? 30 : 20;
  const truncateRestaurantName = (
    name?: string,
    maxLength = maxRestaurantNameLength,
  ) => {
    if (!name) return 'Restaurang';
    return name.length > maxLength
      ? name.slice(0, maxLength).trim() + '…'
      : name;
  };

  return (
    <>
      <Group justify='space-between' align='flex-start' gap='md'>
        <Text fw={800} style={{ flex: 1 }}>
          {title}
        </Text>
        <Text fw={600} c='black' style={{ flexShrink: 0 }}>
          {Math.floor(displayPrice)} kr
        </Text>
      </Group>

      <Text size='sm' mb='xs'>
        med{' '}
        <Text
          span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/profil/${host?.alias}`);
          }}
          className='link-hover'>
          {host?.name}
        </Text>
      </Text>

      <Group mb='xs' gap='xs' align='center' w='100%'>
        <Text
          span
          className='link-hover'
          size='xs'
          c='dimmed'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(
              `/restaurang/${slugify(
                restaurant_name,
              )}${restaurant_id ? '-' + restaurant_id : ''}`,
            );
          }}
          style={{ cursor: 'pointer' }}>
          {' '}
          {truncateRestaurantName(restaurant_name)}
        </Text>
        {/* <Anchor
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(
              `/restaurang/${slugify(
                restaurant_name,
              )}${restaurant_id ? '-' + restaurant_id : ''}`,
            );
          }}
          size='xs'
          c='dimmed'>
          {truncateRestaurantName(restaurant_name)}
        </Anchor> */}
        <Divider orientation='vertical' />
        <Group
          justify='space-between'
          wrap='nowrap'
          style={{ flex: 1 }}
          w='100%'>
          <Text size='xs' c='dimmed'>
            {formattedDate}
            <Text span visibleFrom='xs'>
              {' '}
              {timeRange}
            </Text>
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
      </Group>

      <Group justify='space-between' visibleFrom='xs' w='100%' wrap='nowrap'>
        <Text size='sm' c='dimmed'>
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
    </>
  );
}
