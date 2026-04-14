import ProfilePageImage from './ProfilePageBannerImage';
import ProfilePageAvatar from './ProfilePageAvatar';
import {
  Box,
  Button,
  Center,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import ProfilePageStats from './ProfilePageStats';
import ProfilePageEvents from './ProfilePageEvents';
import { FlagIcon, PenIcon, SettingsIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserByAlias, fetchUsers, type User } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';
import RatingComponent from '../../components/RatingComponent/RatingComponent';
import { getRating } from '../../utils/getRating';

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
      <>
        <Box pos='relative'>
          <Skeleton height={250} />g
          <Center
            style={{
              position: 'absolute',
              bottom: -60,
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
            <Skeleton circle height={120} width={120} />
          </Center>
        </Box>
        <Stack mx='md' gap='xs' mt={80}>
          <Skeleton height={24} width='40%' mx='auto' />
          <Skeleton height={16} width='60%' mx='auto' />
          <Skeleton height={20} width='30%' mx='auto' />
        </Stack>
      </>
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
      <Stack mx='md' gap='xs'>
        <Stack mb='lg'>
          <Group justify='space-between' mt='md'>
            <Title order={2} size='lg' fw='600'>
              {user.name}
            </Title>
            {isLoggedIn && user.id === 1 && (
              <Group gap='xs'>
                <PenIcon size='20px' />
                <SettingsIcon size='20px' />
                <Button variant='transparent' onClick={logout}>
                  Logga ut
                </Button>
              </Group>
            )}
            {isLoggedIn && user.id !== 1 && (
              <Group gap='xs'>
                <FlagIcon color='rgba(211, 4, 59, 1)' />
                <Text size='sm' c='red'>
                  Rapportera användare
                </Text>
              </Group>
            )}
          </Group>
          <Text>{user.bio || 'Ingen biografi ännu.'}</Text>
          <RatingComponent
            value={getRating(user)}
            fractions={2}
            readOnly={true}
          />
        </Stack>
        <ProfilePageEvents userId={user.id} />
      </Stack>
    </>
  );
}
