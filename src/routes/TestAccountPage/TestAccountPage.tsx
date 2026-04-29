import { useEffect, useState } from 'react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Loader,
  Stack,
  Center,
  Code,
  Divider,
  Alert,
} from '@mantine/core';
import { clerkApi, type AccountUser } from '../../api/clerkApi';

export default function TestAccountPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [currentAccount, setCurrentAccount] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/test-auth');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Load account on mount
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadAccount();
    }
  }, [isLoaded, isSignedIn]);

  async function loadAccount() {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Kunde inte hämta Clerk sessionstoken');
        return;
      }

      const account = await clerkApi.getCurrentAccount(token);
      setCurrentAccount(account);
    } catch (err) {
      setError(`Fel vid laddning av konto: ${err instanceof Error ? err.message : 'Okänt fel'}`);
      console.error('[Frontend] Load account failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncAccount() {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        setError('Kunde inte hämta Clerk sessionstoken');
        return;
      }

      await clerkApi.syncAccount(
        {
          clerkUserId: currentAccount?.clerk_user_id || '',
          email: currentAccount?.email || '',
          firstName: currentAccount?.first_name || undefined,
          lastName: currentAccount?.last_name || undefined,
        },
        token
      );

      setSyncStatus('Konto synkroniserat framgångsrikt');
      await loadAccount();
    } catch (err) {
      setError(`Fel vid synkronisering av konto: ${err instanceof Error ? err.message : 'Okänt fel'}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Är du helt säker? Detta kommer att ta bort ditt konto från både den lokala databasen OCH Clerk. Detta kan inte ångras.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError('Kunde inte hämta Clerk sessionstoken');
        return;
      }

      // Call backend to delete
      await clerkApi.deleteOwnAccount(token);

      setCurrentAccount(null);
      setSyncStatus('Konto borttaget! Loggar ut dig...');

      setTimeout(() => {
        signOut();
      }, 2000);
    } catch (err) {
      setError(`Fel vid borttagning av konto: ${err instanceof Error ? err.message : 'Okänt fel'}`);
      console.error('[Frontend] Delete account failed:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <Container py="xl">
        <Center mih={200}>
          <Loader />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title>Kontohantering</Title>
        <Button variant="default" onClick={() => signOut()}>
          Logga ut
        </Button>
      </Group>

      {error && (
        <Alert color="red" mb="md">
          <Text fw={500}>Fel</Text>
          <Text size="sm">{error}</Text>
        </Alert>
      )}

      {syncStatus && (
        <Alert color="green" mb="md">
          <Text fw={500}>Framgång</Text>
          <Text size="sm">{syncStatus}</Text>
        </Alert>
      )}

      {loading && (
        <Paper bg="blue.1" p="md" mb="md">
          <Group>
            <Loader size="sm" />
            <Text>Laddar...</Text>
          </Group>
        </Paper>
      )}

      {currentAccount && (
        <Paper p="md" radius="md" withBorder mb="xl">
          <Title order={2} size="h3" mb="md">
            Ditt konto
          </Title>

          <Stack gap="md">
            <div>
              <Text fw={500} size="sm" c="dimmed">
                Lokalt konto-ID
              </Text>
              <Code>{currentAccount.id}</Code>
            </div>

            <div>
              <Text fw={500} size="sm" c="dimmed">
                Clerk användar-ID
              </Text>
              <Code>{currentAccount.clerk_user_id}</Code>
            </div>

            <div>
              <Text fw={500} size="sm" c="dimmed">
                E-post
              </Text>
              <Text>{currentAccount.email}</Text>
            </div>

            <div>
              <Text fw={500} size="sm" c="dimmed">
                Namn
              </Text>
              <Text>
                {currentAccount.first_name || '(inget förnamn)'} {currentAccount.last_name || '(inget efternamn)'}
              </Text>
            </div>

            <div>
              <Text fw={500} size="sm" c="dimmed">
                Roll
              </Text>
              <Code>{currentAccount.role}</Code>
            </div>

            <div>
              <Text fw={500} size="sm" c="dimmed">
                Skapad
              </Text>
              <Text>{new Date(currentAccount.created_at).toLocaleString('sv-SE')}</Text>
            </div>

            <Divider my="sm" />

            <Group grow>
              <Button onClick={handleSyncAccount} disabled={loading} variant="light">
                Synka konto
              </Button>
              <Button onClick={loadAccount} disabled={loading} variant="light">
                Uppdatera
              </Button>
            </Group>

            <Button
              color="red"
              onClick={handleDeleteAccount}
              disabled={loading}
              fullWidth
            >
              Ta bort mitt konto
            </Button>
          </Stack>
        </Paper>
      )}

      {!currentAccount && !loading && (
        <Alert color="yellow" mb="md">
          <Text>Inget konto hittades. Det här är ovanligt.</Text>
        </Alert>
      )}

      <Paper p="md" radius="md" bg="gray.1" mb="xl">
        <Title order={3} size="h4" mb="md">
          Testa
        </Title>
        <Stack gap="xs">
          <div>
            <Text fw={500}>GET /auth/account/me</Text>
            <Text size="sm" c="dimmed">
              Klicka på &quot;Uppdatera&quot; för att testa denna vägen
            </Text>
          </div>
          <div>
            <Text fw={500}>DELETE /auth/account/me</Text>
            <Text size="sm" c="dimmed">
              Klicka på &quot;Ta bort mitt konto&quot; för att testa denna vägen
            </Text>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}