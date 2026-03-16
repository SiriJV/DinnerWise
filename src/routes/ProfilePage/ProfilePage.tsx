import ProfilePageImage from './ProfilePageBannerImage';
import ProfilePageAvatar from './ProfilePageAvatar';
import { Box, Group, Rating, Stack, Text, Title } from '@mantine/core';
import ProfilePageStats from './ProfilePageStats';
import ProfilePageEvents from './ProfilePageEvents';
import { FlagIcon, PenIcon, SettingsIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserByAlias, fetchUsers, type User } from '../../api/users';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { alias } = useParams<{ alias: string }>();
  const { isLoggedIn, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [eventsCount, setEventsCount] = useState(0);

  useEffect(() => {
    async function loadUser() {
      if (!alias) {
        setError('Ogiltigt alias');
        setLoading(false);
        return;
      }

      const data = await fetchUserByAlias(alias);
      if (!data) {
        setError('Användare hittades inte');
      } else {
        setUser(data);

        // Generate random follower/following counts and lists
        const allUsers = await fetchUsers();
        const otherUsers = allUsers.filter((u) => u.alias !== data.alias);

        // Generate following list first
        const followingCount = Math.floor(
          Math.random() * (otherUsers.length + 1),
        );
        const shuffledForFollowing = [...otherUsers].sort(
          () => Math.random() - 0.5,
        );
        const following = shuffledForFollowing.slice(0, followingCount);
        setFollowingList(following);
        setFollowingCount(followingCount);

        // Generate followers list
        const followersCount = Math.floor(
          Math.random() * (otherUsers.length + 1),
        );
        const shuffledForFollowers = [...otherUsers].sort(
          () => Math.random() - 0.5,
        );
        const followers = shuffledForFollowers.slice(0, followersCount);
        setFollowersList(followers);
        setFollowersCount(followersCount);

        // Calculate events count using deterministic formulas from EventCard
      }
      setLoading(false);
    }

    loadUser();
  }, [alias]);

  if (loading) {
    return (
      <Text p='xl' ta='center' c='dimmed'>
        Laddar profil...
      </Text>
    );
  }

  if (error || !user) {
    return (
      <Text p='xl' ta='center' c='red'>
        {error || 'Användare hittades inte'}
      </Text>
    );
  }

  return (
    <>
      <Box pos='relative'>
        <ProfilePageImage src={user.banner_picture_url} userId={user.id} />
        <ProfilePageAvatar src={user.profile_picture_url} />
        <ProfilePageStats
          followers={followersCount}
          following={followingCount}
          events={eventsCount}
          currentUserAlias={user.alias}
          followersList={followersList}
          followingList={followingList}
        />
      </Box>
      <Stack m='md' gap='xs'>
        <Stack mb='lg'>
          <Group justify='space-between'>
            <Title order={2} size='lg' fw='600'>
              {user.name}
            </Title>
            {isLoggedIn && user.id === 1 && (
              <Group gap='xs'>
                <PenIcon size='20px' />
                <SettingsIcon size='20px' />
                <BaseButton variantType='ghost' onClick={logout}>
                  Logga ut
                </BaseButton>
              </Group>
            )}
            {isLoggedIn && user.id !== 1 && (
              <Group gap='xs'>
                <FlagIcon color='rgba(211, 4, 59, 1)' />
                <Text size='sm' c='rgba(211, 4, 59, 1)'>
                  Rapportera användare
                </Text>
              </Group>
            )}
          </Group>
          <Text>{user.bio || 'Ingen biografi ännu.'}</Text>
          <Rating
            value={3.5}
            fractions={2}
            readOnly
            color='rgba(211, 4, 59, 1)'
          />
        </Stack>
        <ProfilePageEvents userId={user.id} />
      </Stack>
    </>
  );
}
