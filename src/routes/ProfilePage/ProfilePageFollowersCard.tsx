import { Text, Group, Stack, Avatar, Box } from '@mantine/core';
import FollowBadge from './FollowBadge';
import { NavLink } from 'react-router-dom';

interface ProfilePageFollowersCardProps {
  alias: string;
  name: string;
  profile_picture_url?: string;
  following?: boolean;
  onNavigate?: () => void;
}

export default function ProfilePageFollowersCard({
  alias,
  name,
  profile_picture_url,
  following = false,
  onNavigate,
}: ProfilePageFollowersCardProps) {
  return (
    <Group wrap='nowrap' align='center'>
      <NavLink
        to={`/profil/${alias}`}
        onClick={onNavigate}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          gap: '12px',
        }}>
        <Avatar src={profile_picture_url} bd='1px solid gray.5'></Avatar>
        <Stack gap='0' flex={1}>
          <Text fw={600}>{alias}</Text>
          <Text>{name}</Text>
        </Stack>
      </NavLink>
      <FollowBadge following={following} />
    </Group>
  );
}
