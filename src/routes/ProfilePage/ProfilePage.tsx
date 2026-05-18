import ProfilePageImage from './ProfilePageBannerImage';
import ProfilePageAvatar from './ProfilePageAvatar';
import { Alert, Box, Button, Group, Stack, Text, Title, Center, Skeleton } from '@mantine/core';
import ProfilePageStats from './ProfilePageStats';
import ProfilePageEvents from './ProfilePageEvents';
import { FlagIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserByAlias, fetchUsers, type User } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';
import { reportUser } from '../../api/accountUsers';
import { useModal } from '../../contexts/ModalContext';
import RatingComponent from '../../components/RatingComponent/RatingComponent';
import { getRating } from '../../utils/getRating';
import {
  isUserHosting,
  isUserParticipating,
} from '../../utils/deterministicUsers';
import ReportModal from '../../components/Modals/ReportModal/ReportModal';
import { useIsMobile } from '../../hooks/useResponsive';

export default function ProfilePage() {
  const { alias } = useParams<{ alias: string }>();
  const { isLoggedIn, logout } = useAuth();
  const {
    reportUserOpen,
    reportUserReason,
    reportUserDescription,
    openReportUser,
    closeReportUser,
    setReportUserReason,
    setReportUserDescription,
  } = useModal();
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
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

        // Calculate events count - hosting + participating
        try {
          const eventsRes = await fetch('http://localhost:3001/events');
          if (!eventsRes.ok) throw new Error(`HTTP ${eventsRes.status}`);
          const allEvents = await eventsRes.json();
          
          // Validate events response is an array
          if (!Array.isArray(allEvents)) {
            console.warn('ProfilePage: events response is not an array', allEvents);
            setEventsCount(0);
          } else {
            const hostingCount = allEvents.filter((event) =>
              isUserHosting(data.id, event.id, allUsers),
            ).length;

            const participatingCount = allEvents.filter((event) =>
              isUserParticipating(
                data.id,
                event.id,
                event.current_participants,
                allUsers,
              ),
            ).length;

            setEventsCount(hostingCount + participatingCount);
          }
        } catch (err) {
          console.error('Failed to load events count:', err);
          setEventsCount(0);
        }
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
      <Stack mx='md' gap='xs'>
        <Stack mb='lg'>
          <Group justify='space-between' align='flex-start' mt='md'>
            <Title order={2} size='lg' fw='600'>
              {user.name}
            </Title>
            {isLoggedIn && user.id === 1 && (
              <>
                <Stack
                  gap='xs'
                  align='flex-end'
                  display={{ base: 'flex', sm: 'none' }}>
                  <Button
                    c='black'
                    color='gray'
                    variant='subtle'
                    onClick={() =>
                      navigate(`/profil/${user.alias}/installningar`)
                    }>
                    Inställningar{' '}
                  </Button>
                  <Button variant='subtle' onClick={logout}>
                    Logga ut
                  </Button>
                </Stack>
                <Group gap='xs' display={{ base: 'none', sm: 'flex' }}>
                  <Button
                    c='black'
                    color='gray'
                    variant='subtle'
                    onClick={() =>
                      navigate(`/profil/${user.alias}/installningar`)
                    }>
                    Inställningar{' '}
                  </Button>
                  {/* <SettingsIcon
                    size='20px'
                    cursor={'pointer'}
                    onClick={() =>
                      navigate(`/profil/${user.alias}/installningar`)
                    }
                  /> */}
                  <Button variant='subtle' onClick={logout}>
                    Logga ut
                  </Button>
                </Group>
              </>
            )}
            {isLoggedIn && user.id !== 1 && (
              <>
                <Button
                  variant='subtle'
                  leftSection={<FlagIcon />}
                  onClick={openReportUser}>
                  {isMobile ? 'Rapportera' : 'Rapportera användare'}
                </Button>

                <ReportModal
                  opened={reportUserOpen}
                  onClose={closeReportUser}
                  title='Rapportera användare'
                  reasons={[
                    'Stötande eller kränkande beteende',
                    'Falsk profil eller identitet',
                    'Spam eller bedrägeri',
                    'Oönskad kontakt eller trakasserier',
                    'Olämpligt innehåll',
                    'Minderårig användare',
                    'Annat (ange i beskrivning)',
                  ]}
                  reason={reportUserReason}
                  onReasonChange={setReportUserReason}
                  description={reportUserDescription}
                  onDescriptionChange={setReportUserDescription}
                />
              </>
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
