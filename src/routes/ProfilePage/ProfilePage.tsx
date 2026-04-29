import ProfilePageImage from './ProfilePageBannerImage';
import ProfilePageAvatar from './ProfilePageAvatar';
import { Alert, Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import ProfilePageStats from './ProfilePageStats';
import ProfilePageEvents from './ProfilePageEvents';
import { PenIcon, SettingsIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserByAlias, fetchUsers, type User } from '../../api/users';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import { useAuth } from '../../contexts/AuthContext';
import { reportUser } from '../../api/accountUsers';

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
  const [reportStatus, setReportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [hasReported, setHasReported] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

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

  useEffect(() => {
    setReportStatus(null);
    setHasReported(false);
  }, [alias]);

  async function handleReportUser(viewedUser: User) {
    if (reportLoading || hasReported) return;

    console.log('[user-report frontend] handleReportUser called');
    console.log('[user-report frontend] viewedUser.id (legacy users.id from profile page):', viewedUser.id);

    const userId = viewedUser.id;

    if (!Number.isInteger(userId) || userId <= 0) {
      console.error('[user-report frontend] Invalid userId:', userId);
      setReportStatus({ type: 'error', message: 'Kunde inte rapportera användaren' });
      return;
    }

    console.log('[user-report frontend] sending legacy userId:', userId);
    console.log('[user-report frontend] endpoint: POST /users/{userId}/report');

    setReportLoading(true);
    setReportStatus(null);

    try {
      const data = await reportUser(userId, null);
      console.log('[user-report frontend] success:', data);

      setHasReported(true);
      setReportStatus({ type: 'success', message: 'Användaren har rapporterats' });
    } catch (error) {
      console.error('[user-report frontend] report error:', error);
      setReportStatus({ type: 'error', message: 'Kunde inte rapportera användaren' });
    } finally {
      setReportLoading(false);
    }
  }

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

  const viewedUser = user;

  console.log('[profile report button]', {
    viewedUser,
    viewedUserId: viewedUser?.id,
  });

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
              <BaseButton variantType='primary' onClick={logout}>
                Följ
              </BaseButton>
            )}
          </Group>
          <Text>{user.bio || 'Ingen biografi ännu.'}</Text>
          {viewedUser && (
            <Group mt='xs'>
              <Button
                color='red'
                variant='outline'
                size='xs'
                onClick={() => handleReportUser(viewedUser)}
                loading={reportLoading}
                disabled={hasReported}
              >
                {hasReported ? 'Rapporterad' : 'Rapportera användare'}
              </Button>
            </Group>
          )}
          {reportStatus && (
            <Alert mt='xs' color={reportStatus.type === 'success' ? 'green' : 'red'}>
              {reportStatus.message}
            </Alert>
          )}
        </Stack>
        <ProfilePageEvents userId={user.id} />
      </Stack>
    </>
  );
}
