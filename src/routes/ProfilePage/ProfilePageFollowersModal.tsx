import { Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import ProfilePageFollowersCard from './ProfilePageFollowersCard';
import type { User } from '../../api/users';

interface ProfilePageFollowersModalProps {
  type: 'followers' | 'following';
  currentUserAlias: string;
  count: number;
  usersList: User[];
  followingList: User[];
}

export default function ProfilePageFollowersModal({
  type,
  currentUserAlias,
  usersList,
  followingList,
}: ProfilePageFollowersModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    close();
  }, [currentUserAlias, close]);

  const isFollowing = (user: User) => {
    return followingList.some((u) => u.id === user.id);
  };

  const title = type === 'followers' ? 'Följare' : 'Följer';

  return {
    modal: (
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        centered
        size='sm'
        styles={{
          content: {
            maxHeight: 'calc(100vh - 300px)',
            overflowY: 'auto',
          },
        }}>
        <Stack pb='md'>
          {usersList.length === 0 && (
            <Text c='dimmed'>
              {type === 'followers' ? 'Inga följare än' : 'Följer ingen än'}
            </Text>
          )}
          {usersList.map((user) => (
            <ProfilePageFollowersCard
              key={user.id}
              profile_picture_url={user.profile_picture_url}
              alias={user.alias}
              name={user.name}
              following={isFollowing(user)}
              onNavigate={close}
            />
          ))}
        </Stack>
      </Modal>
    ),
    open,
  };
}
