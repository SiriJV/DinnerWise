import { useEffect, useRef, useState } from 'react';
import { useAuth, useUser, useSession, SignUp } from '@clerk/clerk-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, Text, Button, Alert, Stack } from '@mantine/core';
import { clerkApi } from '../../api/clerkApi';

const PAGE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  background: '#e9ecef',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: '3rem 1rem',
};

const INNER: React.CSSProperties = {
  width: '100%',
  maxWidth: 440,
  margin: 'auto 0',
  flexShrink: 0,
};

export default function AcceptInvitationPage() {
  const { isLoaded, isSignedIn, signOut, userId } = useAuth();
  const { user } = useUser();
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [signingOut, setSigningOut] = useState(false);
  const [didSignOutOnThisPage, setDidSignOutOnThisPage] = useState(false);
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
  const syncAttempted = useRef(false);

  useEffect(() => {
    sessionStorage.setItem('pending_invitation_flow', '1');
  }, []);

  useEffect(() => {
    console.log('[AcceptInvitationPage] loaded', window.location.href, Object.fromEntries(searchParams.entries()));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    console.log('[AcceptInvitationPage] auth:', { isSignedIn, userId, email: user?.primaryEmailAddress?.emailAddress });
  }, [isLoaded, isSignedIn, user, userId, session]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !session || !userId) return;
    if (syncAttempted.current) return;

    const arrivedWithExistingSession = !didSignOutOnThisPage && syncState === 'idle';
    const createdAt = user?.createdAt ? new Date(user.createdAt).getTime() : 0;
    const isRecentSignup = createdAt > 0 && Date.now() - createdAt < 5 * 60 * 1000;

    if (createdAt === 0) return;
    if (arrivedWithExistingSession && !isRecentSignup) return;

    syncAttempted.current = true;
    setSyncState('syncing');

    (async () => {
      try {
        const token = await session.getToken();
        if (!token) { setSyncState('error'); return; }
        const account = await clerkApi.getCurrentAccount(token);
        setSyncState('done');
        sessionStorage.removeItem('pending_invitation_flow');
        navigate(account?.role === 'admin' ? '/admin' : '/', { replace: true });
      } catch {
        setSyncState('error');
      }
    })();
  }, [isLoaded, isSignedIn, session, userId, user, navigate, didSignOutOnThisPage, syncState]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setDidSignOutOnThisPage(true);
      syncAttempted.current = false;
      setSyncState('idle');
    } catch (err) {
      console.error('[AcceptInvitationPage] Sign-out failed:', err);
    } finally {
      setSigningOut(false);
    }
  };

  if (!isLoaded || syncState === 'syncing') {
    return (
      <div style={PAGE}>
        <div style={{ ...INNER, textAlign: 'center' }}>
          <Loader size="lg" />
          {syncState === 'syncing' && (
            <Text c="dimmed" size="sm" mt="sm">Skapar ditt konto…</Text>
          )}
        </div>
      </div>
    );
  }

  if (syncState === 'error') {
    return (
      <div style={PAGE}>
        <div style={INNER}>
          <Stack gap="sm">
            <Alert color="red" title="Något gick fel">
              Kunde inte slutföra registreringen. Försök igen senare.
            </Alert>
            <Button variant="outline" onClick={() => navigate('/')}>
              Gå till startsidan
            </Button>
          </Stack>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div style={PAGE}>
        <div style={INNER}>
          <Stack gap="sm">
            <Alert color="yellow" title="Redan inloggad">
              Du är inloggad
              {user?.primaryEmailAddress?.emailAddress && (
                <> som {user.primaryEmailAddress.emailAddress}</>
              )}
              . Logga ut för att acceptera inbjudan.
            </Alert>
            <Button onClick={handleSignOut} loading={signingOut} color="orange" fullWidth>
              Logga ut och fortsätt
            </Button>
          </Stack>
        </div>
      </div>
    );
  }

  return (
    <div style={PAGE}>
      <div style={INNER}>
        <SignUp
          routing="hash"
          signInUrl="/accept-invitation"
          fallbackRedirectUrl="/accept-invitation"
          forceRedirectUrl="/accept-invitation"
        />
      </div>
    </div>
  );
}