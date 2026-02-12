import { Text, Stack, Box, Group } from '@mantine/core';
import './ProfilePage.scss';
import ProfilePageFollowersModal from './ProfilePageFollowersModal';
import type { User } from '../../api/users';

type ProfilePageStatsProps = {
  followers: number;
  following: number;
  events: number;
  currentUserAlias: string;
  followersList: User[];
  followingList: User[];
};

export default function ProfilePageStats({
  followers,
  following,
  events,
  currentUserAlias,
  followersList,
  followingList,
}: ProfilePageStatsProps) {
  const followersModal = ProfilePageFollowersModal({
    type: 'followers',
    currentUserAlias,
    count: followers,
    usersList: followersList,
    followingList: followingList,
  });
  const followingModal = ProfilePageFollowersModal({
    type: 'following',
    currentUserAlias,
    count: following,
    usersList: followingList,
    followingList: followingList,
  });

  return (
    <Group
      gap='xs'
      wrap='nowrap'
      pos='absolute'
      bottom={25}
      right={24}
      bg='white'
      px='xs'
      py='xs'
      className='stats-wrapper'>
      {followingModal.modal}

      <Box px='xs' py='xs' className='stats'>
        <Stack
          align='center'
          gap='xs'
          style={{ cursor: 'pointer' }}
          onClick={followingModal.open}>
          <Text fw={700} size='md'>
            {following}
          </Text>
          <Text c='dimmed' size='xs'>
            Följer
          </Text>
        </Stack>
      </Box>

      {followersModal.modal}
      <Box px='xs' py='xs' className='stats'>
        <Stack
          align='center'
          gap='xs'
          style={{ cursor: 'pointer' }}
          onClick={followersModal.open}>
          <Text fw={700} size='md'>
            {followers}
          </Text>
          <Text c='dimmed' size='xs'>
            Följare
          </Text>
        </Stack>
      </Box>

      <Box px='xs' py='xs' className='stats'>
        <Stack align='center' gap='xs'>
          <Text fw={700} size='md'>
            {events}
          </Text>
          <Text c='dimmed' size='xs'>
            Event
          </Text>
        </Stack>
      </Box>
    </Group>
  );
}
