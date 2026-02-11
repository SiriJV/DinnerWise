import { Text, Group, Stack, Avatar } from '@mantine/core';
import FollowBadge from './FollowBadge';

interface ProfilePageFollowersCardProps {
  alias: string;
  name: string;
  following?: boolean;
}

export default function ProfilePageFollowersCard({
  alias,
  name,
  following = false,
}: ProfilePageFollowersCardProps) {
  return (
    <Group wrap='nowrap' align='center'>
      <Avatar></Avatar>
      <Stack gap='0' flex={1}>
        <Text fw={600}>{alias}</Text>
        <Text>{name}</Text>
      </Stack>
      <FollowBadge following={following} />
    </Group>
  );
}
