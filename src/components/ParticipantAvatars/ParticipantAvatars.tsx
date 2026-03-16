import { Avatar, Tooltip, Box, Popover, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './ParticipantAvatars.scss';
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
  const navigate = useNavigate();
  const [popoverOpened, setPopoverOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const avatarSize = size === 'responsive' ? (isMobile ? 'md' : 'lg') : size;

  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <Avatar.Group spacing={size === 'lg' ? 'sm' : 'xs'}>
        {participants.slice(0, maxVisible).map((user) => (
          <Tooltip key={user.id} label={user.name} withArrow>
            <Box
              className='unstyledNavLink'
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profil/${user.alias}`);
              }}
              style={{ cursor: 'pointer' }}>
              <Avatar
                src={user.profile_picture_url}
                radius='xl'
                size={avatarSize}
                className='hover-style'
              />
            </Box>
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
              {participants.slice(maxVisible).map((user) => (
                <Box
                  key={user.id}
                  className='unstyledNavLink'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profil/${user.alias}`);
                  }}
                  style={{
                    display: 'block',
                    padding: '2px 0',
                    color: 'var(--mantine-color-white)',
                    cursor: 'pointer',
                  }}>
                  {user.name}
                </Box>
              ))}
            </Popover.Dropdown>
          </Popover>
        )}
      </Avatar.Group>
    </Tooltip.Group>
  );
}
