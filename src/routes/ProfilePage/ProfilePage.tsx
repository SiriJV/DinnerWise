import ProfilePageImage from './ProfilePageBannerImage';
import ProfilePageAvatar from './ProfilePageAvatar';
import { Box, Group, Stack, Text, Title } from '@mantine/core';
import ProfilePageStats from './ProfilePageStats';
import ProfilePageEvents from './ProfilePageEvents';
import { PenIcon, SettingsIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserByAlias, fetchUsers, type User } from '../../api/users';
import { fetchEvents } from '../../api/events';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import { useAuth } from '../../contexts/AuthContext';

// Helper function to determine if a user is host or participant in an event
function isUserInEvent(
  eventId: number,
  userId: number,
  currentParticipants: number,
  allUsers: User[],
): boolean {
  // Check if user is host
  const hostIndex = eventId % allUsers.length;
  if (allUsers[hostIndex].id === userId) {
    return true;
  }

  // Check if user is a participant
  const numParticipants = Math.min(currentParticipants || 0, allUsers.length);
  for (let i = 0; i < numParticipants; i++) {
    const participantIndex = (eventId * 7 + i * 13) % allUsers.length;
    if (allUsers[participantIndex].id === userId) {
      return true;
    }
  }

  return false;
}

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
        const allEvents = await fetchEvents();
        const userEventsCount = allEvents.filter((event) =>
          isUserInEvent(
            event.id,
            data.id,
            event.current_participants,
            allUsers,
          ),
        ).length;
        setEventsCount(userEventsCount);
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
        </Group>
        <Text>{user.bio || 'Ingen biografi ännu.'}</Text>
        <ProfilePageEvents userId={user.id} />
      </Stack>
    </>
  );
}
