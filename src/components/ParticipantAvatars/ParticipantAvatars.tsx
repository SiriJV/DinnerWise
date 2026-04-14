import {
  Avatar,
  Tooltip,
  Box,
  Popover,
  Text,
  Stack,
  Group,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

type User = {
  id: number;
  name: string;
  alias: string;
  profile_picture_url?: string;
};

type ParticipantAvatarsProps = {
  participants: User[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  currentParticipants?: number;
  maxParticipants?: number;
};

export default function ParticipantAvatars({
  participants,
  maxVisible = 3,
  size = 'sm',
  currentParticipants,
  maxParticipants,
}: ParticipantAvatarsProps) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const avatarSize = size === 'responsive' ? (isMobile ? 'md' : 'lg') : size;
  const navigate = useNavigate();

  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <Avatar.Group spacing={size === 'lg' ? 'sm' : 'xs'}>
        {participants.slice(0, maxVisible).map((user) => (
          <Tooltip key={user.id} label={user.name} withArrow>
            <Avatar
              key={user.id}
              src={user?.profile_picture_url}
              alt={user.name}
              radius='xl'
              size={avatarSize}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/profil/${user?.alias}`);
              }}
              className='hover-style'
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        ))}
        {participants.length > maxVisible && (
          <Popover
            width={200}
            position='top'
            withArrow
            shadow='md'
            opened={popoverOpened}
            onChange={setPopoverOpened}>
            <Popover.Target>
              <Box
                onMouseEnter={() => setPopoverOpened(true)}
                onMouseLeave={() => setPopoverOpened(false)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
                <Avatar radius='xl' size={size} style={{ cursor: 'pointer' }}>
                  +{participants.length - maxVisible}
                </Avatar>
              </Box>
            </Popover.Target>
            <Popover.Dropdown
              onMouseEnter={() => setPopoverOpened(true)}
              onMouseLeave={() => setPopoverOpened(false)}
              style={{
                backgroundColor: 'var(--mantine-color-dark-6)',
                color: 'var(--mantine-color-white)',
                padding: '0.5rem',
                fontSize: 'var(--mantine-font-size-sm)',
                border: 'none',
              }}>
              {currentParticipants !== undefined &&
                maxParticipants !== undefined && (
                  <Text size='xs' mb='xs' style={{ opacity: 0.8 }}>
                    {currentParticipants}/{maxParticipants} deltagare
                  </Text>
                )}
              <Stack gap='xs'>
                {participants.slice(maxVisible).map((user) => (
                  <Group
                    className='link-hover'
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/profil/${user?.alias}`);
                    }}>
                    <Avatar
                      key={user.id}
                      src={user?.profile_picture_url}
                      alt={user.name}
                      radius='xl'
                      size={avatarSize}
                      bd='none'
                    />
                    {user.name}
                  </Group>
                ))}
              </Stack>
            </Popover.Dropdown>
          </Popover>
        )}
      </Avatar.Group>
    </Tooltip.Group>
  );
}
