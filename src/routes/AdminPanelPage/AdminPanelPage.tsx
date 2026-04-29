import { useEffect, useState, useMemo } from 'react';
import { useAuth, useSession, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Paper,
  Table,
  TextInput,
  Button,
  Tabs,
  Center,
  Loader,
  Alert,
  Group,
  Badge,
  Stack,
  Modal,
  Divider,
} from '@mantine/core';
import {
  Users,
  CalendarDays,
  AlertTriangle,
  MailPlus,
  Search,
  AlertCircle,
  Check,
} from 'lucide-react';
import { clerkApi, type AccountUser } from '../../api/clerkApi';
import {
  fetchAdminUsers,
  fetchAdminEvents,
  fetchAdminReportedEvents,
  fetchAdminReportedUsers,
  fetchAdminEventDetails,
  deleteAdminEvent,
  dismissAdminReport,
  dismissAdminUserReport,
  deleteAdminUser,
  inviteAdmin,
  type InviteResult,
  type ReportedEvent,
  type ReportedUser,
  type AdminEventDetails,
} from '../../api/admin';
import type { Event } from '../../api/events';

export default function AdminPanelPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/admin-login', { replace: true });
  }

  // Auth / role state
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Data
  const [users, setUsers] = useState<AccountUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [reportedEvents, setReportedEvents] = useState<ReportedEvent[]>([]);
  const [reportedUsers, setReportedUsers] = useState<ReportedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingReportedEvents, setLoadingReportedEvents] = useState(true);
  const [loadingReportedUsers, setLoadingReportedUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [reportedEventsError, setReportedEventsError] = useState<string | null>(null);
  const [reportedUsersError, setReportedUsersError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [moderationMessage, setModerationMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Search
  const [userSearch, setUserSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');

  // Invite
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteResult, setInviteResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportedEvent | null>(null);
  const [selectedEventDetails, setSelectedEventDetails] =
    useState<AdminEventDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dismissLoading, setDismissLoading] = useState(false);
  const [reportedUserModalOpen, setReportedUserModalOpen] = useState(false);
  const [selectedReportedUser, setSelectedReportedUser] = useState<ReportedUser | null>(null);
  const [dismissUserReportLoading, setDismissUserReportLoading] = useState(false);
  const [deleteReportedUserLoading, setDeleteReportedUserLoading] = useState(false);

  async function getAdminToken(): Promise<string> {
    const token = (await session?.getToken()) || '';
    if (!token) throw new Error('Auth token krävs');
    return token;
  }

  async function loadEventsData(token?: string) {
    const authToken = token || (await getAdminToken());
    setLoadingEvents(true);
    setEventsError(null);
    try {
      const e = await fetchAdminEvents(authToken);
      setEvents(e);
    } catch (err) {
      console.error('Error loading events:', err);
      setEventsError('Kunde inte hämta events');
    } finally {
      setLoadingEvents(false);
    }
  }

  async function loadReportedEventsData(token?: string) {
    const authToken = token || (await getAdminToken());
    setLoadingReportedEvents(true);
    setReportedEventsError(null);
    try {
      const re = await fetchAdminReportedEvents(authToken);
      setReportedEvents(re);
    } catch (err) {
      console.error('Error loading reported events:', err);
      setReportedEventsError('Kunde inte hämta rapporterade events');
    } finally {
      setLoadingReportedEvents(false);
    }
  }

  async function loadReportedUsersData(token?: string) {
    const authToken = token || (await getAdminToken());
    setLoadingReportedUsers(true);
    setReportedUsersError(null);
    try {
      const reported = await fetchAdminReportedUsers(authToken);
      setReportedUsers(reported);
    } catch (err) {
      console.error('Error loading reported users:', err);
      setReportedUsersError('Kunde inte hämta rapporterade användare');
    } finally {
      setLoadingReportedUsers(false);
    }
  }

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate('/admin-login', { replace: true });
      return;
    }
    if (!session) return;

    let cancelled = false;
    (async () => {
      try {
        let token: string | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          token = await session.getToken();
          if (token) break;
          await new Promise((r) => setTimeout(r, 500));
        }

        if (!token) {
          if (!cancelled) setAuthorized(false);
          return;
        }

        const account = await clerkApi.getCurrentAccount(token);

        if (cancelled) return;

        if (account.role === 'admin') {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.error('Error checking admin role:', err);
        if (!cancelled) setAuthorized(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, session, navigate]);

  useEffect(() => {
    if (authorized !== true || !session) return;

    let cancelled = false;

    async function loadData() {
      setUsersError(null);
      setEventsError(null);
      setReportedEventsError(null);
      setReportedUsersError(null);
      setPageError(null);
      try {
        const token = (await session!.getToken()) || '';

        setLoadingUsers(true);
        try {
          const u = await fetchAdminUsers(token);
          if (!cancelled) setUsers(u);
        } catch (err) {
          console.error('Error loading users:', err);
          if (!cancelled) setUsersError('Kunde inte hämta användare');
        } finally {
          if (!cancelled) setLoadingUsers(false);
        }

        // Load events
        await loadEventsData(token);

        // Load reported events
        await loadReportedEventsData(token);

        // Load reported users
        await loadReportedUsersData(token);
      } catch (err) {
        console.error('[Frontend] token retrieval failed:', err);
        if (!cancelled) setPageError('Kunde inte hämta adminpanelen');
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [authorized, session]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.first_name?.toLowerCase().includes(q) ||
        u.last_name?.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, userSearch]);

  const filteredEvents = useMemo(() => {
    if (!eventSearch) return events;
    const q = eventSearch.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.restaurant_name?.toLowerCase().includes(q) ||
        e.category_name?.toLowerCase().includes(q),
    );
  }, [events, eventSearch]);

  async function handleInvite() {
    if (!inviteEmail || !session) return;
    setInviteSending(true);
    setInviteResult(null);
    try {
      const token = (await session.getToken()) || '';
      const result: InviteResult = await inviteAdmin(inviteEmail, token);
      setInviteResult({ type: 'success', message: result.message });
      setInviteEmail('');
    } catch (err: any) {
      console.error('[AdminPanel] Invite response: error', err.message);
      setInviteResult({
        type: 'error',
        message: err.message || 'Kunde inte skicka inbjudan',
      });
    } finally {
      setInviteSending(false);
    }
  }

  async function handleOpenEventModal(report: ReportedEvent) {
    setSelectedReport(report);
    setSelectedEventDetails(null);
    setDetailsError(null);
    setDetailsModalOpen(true);
    setDetailsLoading(true);

    try {
      const token = await getAdminToken();
      const details = await fetchAdminEventDetails(report.event_id, token);
      setSelectedEventDetails(details);
    } catch (err: any) {
      setDetailsError(err.message || 'Kunde inte hämta eventet');
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleDeleteEvent() {
    if (!selectedReport) return;

    const confirmed = window.confirm(
      'Är du säker på att du vill ta bort eventet? Detta går inte att ångra.',
    );
    if (!confirmed) return;

    setDeleteLoading(true);
    setDetailsError(null);
    try {
      const token = await getAdminToken();
      await deleteAdminEvent(selectedReport.event_id, token);
      await Promise.all([loadReportedEventsData(token), loadEventsData(token)]);
      setModerationMessage({ type: 'success', message: 'Eventet har tagits bort' });
      setDetailsModalOpen(false);
      setSelectedReport(null);
      setSelectedEventDetails(null);
    } catch (err: any) {
      setDetailsError(err.message || 'Kunde inte ta bort eventet');
      setModerationMessage({ type: 'error', message: 'Kunde inte ta bort eventet' });
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleDismissReport() {
    if (!selectedReport) return;

    const confirmed = window.confirm(
      'Är du säker på att du vill avfärda rapporten? Eventet kommer att behållas.',
    );
    if (!confirmed) return;

    setDismissLoading(true);
    setDetailsError(null);
    try {
      const token = await getAdminToken();
      await dismissAdminReport(selectedReport.report_id, token);
      await loadReportedEventsData(token);
      setModerationMessage({ type: 'success', message: 'Rapporten har avfärdats' });
      setDetailsModalOpen(false);
      setSelectedReport(null);
      setSelectedEventDetails(null);
    } catch (err: any) {
      setDetailsError('Kunde inte avfärda rapporten');
      setModerationMessage({ type: 'error', message: 'Kunde inte avfärda rapporten' });
    } finally {
      setDismissLoading(false);
    }
  }

  function handleOpenReportedUserModal(report: ReportedUser) {
    setSelectedReportedUser(report);
    setReportedUserModalOpen(true);
  }

  async function handleDismissUserReport() {
    if (!selectedReportedUser) return;

    const confirmed = window.confirm(
      'Är du säker på att du vill avfärda rapporten? Användaren kommer att behållas.',
    );
    if (!confirmed) return;

    setDismissUserReportLoading(true);
    try {
      const token = await getAdminToken();
      await dismissAdminUserReport(selectedReportedUser.report_id, token);
      await loadReportedUsersData(token);
      setModerationMessage({ type: 'success', message: 'Rapporten har avfärdats' });
      setReportedUserModalOpen(false);
      setSelectedReportedUser(null);
    } catch (err) {
      setModerationMessage({ type: 'error', message: 'Kunde inte avfärda rapporten' });
    } finally {
      setDismissUserReportLoading(false);
    }
  }

  async function handleDeleteReportedUser() {
    if (!selectedReportedUser) return;

    const confirmed = window.confirm(
      'Är du säker på att du vill ta bort användaren? Detta går inte att ångra.',
    );
    if (!confirmed) return;

    setDeleteReportedUserLoading(true);
    try {
      const token = await getAdminToken();
      await deleteAdminUser(selectedReportedUser.reported_account_user_id, token);
      await loadReportedUsersData(token);
      const usersList = await fetchAdminUsers(token);
      setUsers(usersList);
      setModerationMessage({ type: 'success', message: 'Användaren har tagits bort' });
      setReportedUserModalOpen(false);
      setSelectedReportedUser(null);
    } catch (err) {
      setModerationMessage({ type: 'error', message: 'Kunde inte ta bort användaren' });
    } finally {
      setDeleteReportedUserLoading(false);
    }
  }

  if (!isLoaded || authorized === null) {
    return (
      <Container py="xl">
        <Center mih={300}>
          <Stack align="center" gap="sm">
            <Loader />
            <Text c="dimmed" size="sm">Laddar konto...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (authorized === false) {
    return (
      <Container size="xs" py="xl">
        <Alert icon={<AlertCircle size={16} />} title="Obehörig" color="red">
          Du har inte behörighet att visa denna sida.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="flex-end" mb="md" gap="xs">
        <Button variant="subtle" size="xs" onClick={() => navigate('/')}>
          Hem
        </Button>
        <Button variant="subtle" size="xs" color="red" onClick={handleSignOut}>
          Logga ut
        </Button>
      </Group>

      <Title mb="xs">Adminpanel</Title>
      <Text c="dimmed" mb="xl">
        Hantera användare, events och inbjudningar
      </Text>

      {pageError && (
        <Alert icon={<AlertCircle size={16} />} color="red" mb="md" withCloseButton onClose={() => setPageError(null)}>
          {pageError}
        </Alert>
      )}

      {moderationMessage && (
        <Alert
          icon={<AlertCircle size={16} />}
          color={moderationMessage.type === 'success' ? 'green' : 'red'}
          mb="md"
          withCloseButton
          onClose={() => setModerationMessage(null)}
        >
          {moderationMessage.message}
        </Alert>
      )}

      <Modal
        opened={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setDetailsError(null);
        }}
        title="Granska rapporterat event"
        centered
        size="lg"
      >
        <Stack gap="md">
          {detailsLoading ? (
            <Center py="xl">
              <Stack align="center" gap="xs">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">Laddar eventdetaljer...</Text>
              </Stack>
            </Center>
          ) : detailsError ? (
            <Alert icon={<AlertCircle size={16} />} color="red">
              {detailsError}
            </Alert>
          ) : (
            <>
              <Stack gap="xs">
                <Text fw={600}>Rapport</Text>
                <Text size="sm">
                  <strong>Rapporteringsorsak:</strong> {selectedReport?.reason?.trim() || '...'}
                </Text>
                <Text size="sm">
                  <strong>Rapporterad av:</strong> {selectedReport?.reporter_email || 'Anonym'}
                </Text>
              </Stack>

              <Divider />

              <Stack gap="xs">
                <Text fw={600}>Event</Text>
                <Text size="sm">
                  <strong>Namn:</strong> {selectedEventDetails?.title || selectedReport?.event_title || 'Okänt event'}
                </Text>
                <Text size="sm">
                  <strong>Beskrivning:</strong> {selectedEventDetails?.description || selectedReport?.event_description || 'Ingen beskrivning angiven'}
                </Text>
                <Text size="sm">
                  <strong>Datum/tid:</strong>{' '}
                  {(selectedEventDetails?.date || selectedReport?.event_date)
                    ? `${new Date(selectedEventDetails?.date || selectedReport!.event_date).toLocaleDateString('sv-SE')} ${selectedEventDetails?.start_time || selectedReport?.event_start_time || ''}${selectedEventDetails?.end_time ? ` – ${selectedEventDetails.end_time}` : selectedReport?.event_end_time ? ` – ${selectedReport.event_end_time}` : ''}`
                    : '–'}
                </Text>
                <Text size="sm">
                  <strong>Plats:</strong>{' '}
                  {selectedEventDetails?.restaurant_name || selectedReport?.restaurant_name || '–'}
                  {(selectedEventDetails?.restaurant_address || selectedReport?.restaurant_address)
                    ? `, ${selectedEventDetails?.restaurant_address || selectedReport?.restaurant_address}`
                    : ''}
                  {(selectedEventDetails?.restaurant_city || selectedReport?.restaurant_city)
                    ? `, ${selectedEventDetails?.restaurant_city || selectedReport?.restaurant_city}`
                    : ''}
                </Text>
                <Text size="sm">
                  <strong>ID:</strong> {selectedEventDetails?.id || selectedReport?.event_id || '–'}
                </Text>
              </Stack>

              <Group justify="space-between" mt="sm">
                <Button variant="default" onClick={() => setDetailsModalOpen(false)} disabled={deleteLoading || dismissLoading}>
                  Stäng
                </Button>
                <Group>
                  <Button variant="default" onClick={handleDismissReport} loading={dismissLoading} disabled={deleteLoading}>
                    Avfärda rapport
                  </Button>
                  <Button color="red" onClick={handleDeleteEvent} loading={deleteLoading} disabled={dismissLoading}>
                    Ta bort event
                  </Button>
                </Group>
              </Group>
            </>
          )}
        </Stack>
      </Modal>

      <Modal
        opened={reportedUserModalOpen}
        onClose={() => {
          setReportedUserModalOpen(false);
          setSelectedReportedUser(null);
        }}
        title="Granska rapporterad användare"
        centered
      >
        <Stack gap="md">
          <Stack gap="xs">
            <Text fw={600}>Rapport</Text>
            <Text size="sm">
              <strong>Rapporteringsorsak:</strong> {selectedReportedUser?.reason?.trim() || '...'}
            </Text>
            <Text size="sm">
              <strong>Rapporterad av:</strong> {selectedReportedUser?.reporter_email || 'Anonym'}
            </Text>
          </Stack>

          <Divider />

          <Stack gap="xs">
            <Text fw={600}>Användare</Text>
            <Text size="sm"><strong>ID:</strong> {selectedReportedUser?.reported_account_user_id}</Text>
            <Text size="sm"><strong>Email:</strong> {selectedReportedUser?.reported_user_email || '–'}</Text>
            <Text size="sm">
              <strong>Namn:</strong>{' '}
              {[selectedReportedUser?.reported_user_first_name, selectedReportedUser?.reported_user_last_name]
                .filter(Boolean)
                .join(' ') || '–'}
            </Text>
            <Text size="sm"><strong>Roll:</strong> {selectedReportedUser?.reported_user_role || '–'}</Text>
            <Text size="sm"><strong>Clerk user id:</strong> {selectedReportedUser?.reported_user_clerk_user_id || '–'}</Text>
          </Stack>

          <Group justify="space-between" mt="sm">
            <Button
              variant="default"
              onClick={() => {
                setReportedUserModalOpen(false);
                setSelectedReportedUser(null);
              }}
              disabled={dismissUserReportLoading || deleteReportedUserLoading}
            >
              Stäng
            </Button>
            <Group>
              <Button
                variant="default"
                onClick={handleDismissUserReport}
                loading={dismissUserReportLoading}
                disabled={deleteReportedUserLoading}
              >
                Avfärda rapport
              </Button>
              <Button
                color="red"
                onClick={handleDeleteReportedUser}
                loading={deleteReportedUserLoading}
                disabled={dismissUserReportLoading}
              >
                Ta bort användare
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>

      <Tabs defaultValue="users">
        <Tabs.List mb="md">
          <Tabs.Tab value="users" leftSection={<Users size={16} />}>
            Användare
          </Tabs.Tab>
          <Tabs.Tab value="events" leftSection={<CalendarDays size={16} />}>
            Events
          </Tabs.Tab>
          <Tabs.Tab
            value="reported-users"
            leftSection={<AlertTriangle size={16} />}
          >
            Rapporterade användare
          </Tabs.Tab>
          <Tabs.Tab
            value="reported-events"
            leftSection={<AlertTriangle size={16} />}
          >
            Rapporterade events
          </Tabs.Tab>
          <Tabs.Tab value="invite" leftSection={<MailPlus size={16} />}>
            Bjud in ny admin
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="users">
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Användare</Title>
              <Badge size="lg">{users.length} totalt</Badge>
            </Group>
            <TextInput
              placeholder="Sök användare..."
              leftSection={<Search size={16} />}
              mb="md"
              value={userSearch}
              onChange={(e) => setUserSearch(e.currentTarget.value)}
            />
            {loadingUsers ? (
              <Center mih={100}>
                <Stack align="center" gap="xs">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">Laddar användare...</Text>
                </Stack>
              </Center>
            ) : usersError ? (
              <Alert icon={<AlertCircle size={16} />} color="red" mb="md">
                {usersError}
              </Alert>
            ) : filteredUsers.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Inga användare hittades
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>E-post</Table.Th>
                    <Table.Th>Förnamn</Table.Th>
                    <Table.Th>Efternamn</Table.Th>
                    <Table.Th>Roll</Table.Th>
                    <Table.Th>Skapad</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredUsers.map((u) => (
                    <Table.Tr key={u.id}>
                      <Table.Td>{u.id}</Table.Td>
                      <Table.Td>{u.email}</Table.Td>
                      <Table.Td>{u.first_name || '–'}</Table.Td>
                      <Table.Td>{u.last_name || '–'}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={u.role === 'admin' ? 'red' : 'blue'}
                          variant="light"
                        >
                          {u.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {new Date(u.created_at).toLocaleDateString('sv-SE')}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="events">
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Events</Title>
              <Badge size="lg">{events.length} totalt</Badge>
            </Group>
            <TextInput
              placeholder="Sök events..."
              leftSection={<Search size={16} />}
              mb="md"
              value={eventSearch}
              onChange={(e) => setEventSearch(e.currentTarget.value)}
            />
            {loadingEvents ? (
              <Center mih={100}>
                <Stack align="center" gap="xs">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">Laddar events...</Text>
                </Stack>
              </Center>
            ) : eventsError ? (
              <Alert icon={<AlertCircle size={16} />} color="red" mb="md">
                {eventsError}
              </Alert>
            ) : filteredEvents.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Inga events hittades
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Titel</Table.Th>
                    <Table.Th>Datum</Table.Th>
                    <Table.Th>Restaurang</Table.Th>
                    <Table.Th>Kategori</Table.Th>
                    <Table.Th>Pris</Table.Th>
                    <Table.Th>Deltagare</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredEvents.map((e) => (
                    <Table.Tr key={e.id}>
                      <Table.Td>{e.id}</Table.Td>
                      <Table.Td>{e.title}</Table.Td>
                      <Table.Td>
                        {new Date(e.date).toLocaleDateString('sv-SE')}
                      </Table.Td>
                      <Table.Td>{e.restaurant_name || '–'}</Table.Td>
                      <Table.Td>{e.category_name || '–'}</Table.Td>
                      <Table.Td>{e.price} kr</Table.Td>
                      <Table.Td>
                        {e.current_participants}
                        {e.max_participants ? ` / ${e.max_participants}` : ''}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="reported-users">
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">
              Rapporterade användare
            </Title>

            {loadingReportedUsers ? (
              <Center py="xl">
                <Stack align="center" gap="sm">
                  <Loader size="sm" />
                  <Text c="dimmed" size="sm">Laddar rapporterade användare...</Text>
                </Stack>
              </Center>
            ) : reportedUsersError ? (
              <Alert icon={<AlertCircle size={16} />} color="red" mb="md">
                {reportedUsersError}
              </Alert>
            ) : reportedUsers.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Inga rapporterade användare för tillfället
              </Text>
            ) : (
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Användare</Table.Th>
                    <Table.Th>Rapporteringsorsak</Table.Th>
                    <Table.Th>Rapporterad av</Table.Th>
                    <Table.Th>Åtgärd</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reportedUsers.map((report) => (
                    <Table.Tr key={report.report_id}>
                      <Table.Td>
                        <Stack gap={0}>
                          <Text fw={500} size="sm">{report.reported_user_email}</Text>
                          <Text size="xs" c="dimmed">Användar-ID: {report.reported_account_user_id}</Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{report.reason?.trim() || '...'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{report.reporter_email || 'Anonym'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Button size="xs" variant="light" onClick={() => handleOpenReportedUserModal(report)}>
                          Granska
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="reported-events">
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="md">
              Rapporterade events
            </Title>

            {loadingReportedEvents ? (
              <Center py="xl">
                <Stack align="center" gap="sm">
                  <Loader size="sm" />
                  <Text c="dimmed" size="sm">Laddar rapporterade events...</Text>
                </Stack>
              </Center>
            ) : reportedEventsError ? (
              <Alert icon={<AlertCircle size={16} />} color="red" mb="md">
                Kunde inte hämta rapporterade events
              </Alert>
            ) : reportedEvents.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Inga rapporterade events för tillfället
              </Text>
            ) : (
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Event</Table.Th>
                    <Table.Th>Rapporteringsorsak</Table.Th>
                    <Table.Th>Rapporterad av</Table.Th>
                    <Table.Th>Åtgärd</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reportedEvents.map((report) => (
                    <Table.Tr key={report.report_id}>
                      <Table.Td>
                        <Group gap={0} grow>
                          <div>
                            <Text fw={500} size="sm">{report.event_title}</Text>
                            <Text size="xs" c="dimmed">Event-ID: {report.event_id}</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {report.reason?.trim() || '...'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{report.reporter_email || 'Anonym'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Button size="xs" variant="light" onClick={() => handleOpenEventModal(report)}>
                          Granska
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="invite">
          <Paper p="md" radius="md" withBorder>
            <Title order={3} mb="xs">
              Bjud in ny admin
            </Title>
            <Text c="dimmed" size="sm" mb="md">
              Skicka en inbjudan via Clerk till en ny administratör.
              När den inbjudna användaren registrerar sig får de automatiskt admin-rollen.
            </Text>

            <Stack gap="sm" maw={400}>
              <TextInput
                label="E-postadress"
                placeholder="admin@exempel.se"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.currentTarget.value)}
                disabled={inviteSending}
              />
              <Button
                leftSection={<MailPlus size={16} />}
                onClick={handleInvite}
                loading={inviteSending}
                disabled={!inviteEmail}
              >
                Skicka inbjudan
              </Button>
            </Stack>

            {inviteResult && (
              <Alert
                mt="md"
                color={inviteResult.type === 'success' ? 'green' : 'red'}
                icon={
                  inviteResult.type === 'success' ? (
                    <Check size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )
                }
              >
                {inviteResult.message}
              </Alert>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}