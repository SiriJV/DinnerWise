import { Avatar, Tooltip, Box, Popover, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

type User = {
  id: number;
  name: string;
  alias: string;
  profile_picture_url?: string;
};

type ParticipantAvatarsProps = {
  participants: User[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
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

  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <Avatar.Group spacing={size === 'lg' ? 'sm' : 'xs'}>
        {participants.slice(0, maxVisible).map((user) => (
          <Tooltip key={user.id} label={user.name} withArrow>
            <NavLink
              to={`/profil/${user.alias}`}
              className='unstyledNavLink'
              onClick={(e) => e.stopPropagation()}>
              <Avatar src={user.profile_picture_url} radius='xl' size={size} />
            </NavLink>
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
                <NavLink
                  key={user.id}
                  to={`/profil/${user.alias}`}
                  className='unstyledNavLink'
                  style={{
                    display: 'block',
                    padding: '2px 0',
                    color: 'var(--mantine-color-white)',
                    textDecoration: 'none',
                  }}>
                  {user.name}
                </NavLink>
              ))}
            </Popover.Dropdown>
          </Popover>
        )}
      </Avatar.Group>
    </Tooltip.Group>
  );
}
