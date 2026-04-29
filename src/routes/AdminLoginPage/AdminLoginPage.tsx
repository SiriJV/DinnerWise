import { useEffect, useState } from 'react';
import { useAuth, useSession, useClerk, SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Loader, Alert, Stack, Button } from '@mantine/core';
import { AlertCircle, LogOut } from 'lucide-react';
import { clerkApi } from '../../api/clerkApi';
import { clerkLoginOnlyAppearance } from '../../components/AuthLayout/clerkAppearance';

const PAGE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  background: '#f1f3f5',
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

const adminSignInAppearance = {
  ...clerkLoginOnlyAppearance,
  elements: {
    ...(clerkLoginOnlyAppearance.elements as Record<string, any>),
    rootBox: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    cardBox: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    card: {
      ...(clerkLoginOnlyAppearance.elements as Record<string, any>)?.card,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    headerTitle: {
      fontSize: '0px',
      lineHeight: '0px',
      overflow: 'hidden',
      '&::after': {
        content: '"Logga in som administratör"',
        display: 'block',
        fontSize: '20px',
        lineHeight: '1.4',
        fontWeight: 600,
        textAlign: 'center' as const,
      },
    },
    headerSubtitle: { display: 'none' },
  },
};

export default function AdminLoginPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  console.log('[AdminLogin] render — isLoaded:', isLoaded, '| isSignedIn:', isSignedIn, '| checking:', checking, '| unauthorized:', unauthorized);

  useEffect(() => {
    if (!isSignedIn) {
      setUnauthorized(false);
      setChecking(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !session) return;

    let cancelled = false;

    async function checkAdminRole() {
      setChecking(true);
      setUnauthorized(false);
      try {
        let token: string | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          token = await session!.getToken();
          if (token) break;
          console.log(`[AdminLogin] getToken attempt ${attempt + 1} returned null, retrying...`);
          await new Promise((r) => setTimeout(r, 500));
        }

        console.log('[AdminLogin] token obtained:', !!token);

        if (!token) {
          console.error('[AdminLogin] Could not obtain Clerk token after retries');
          if (!cancelled) setUnauthorized(true);
          return;
        }

        const account = await clerkApi.getCurrentAccount(token);
        console.log('[AdminLogin] account response:', {
          id: account.id,
          email: account.email,
          role: account.role,
        });

        if (cancelled) return;

        if (account.role === 'admin') {
          console.log('[AdminLogin] ✓ Admin — redirecting to /admin');
          navigate('/admin', { replace: true });
        } else {
          console.log('[AdminLogin] ✗ Role is not admin:', account.role);
          setUnauthorized(true);
        }
      } catch (err) {
        console.error('[AdminLogin] checkAdminRole error:', err);
        if (!cancelled) setUnauthorized(true);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkAdminRole();
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, session, navigate]);

  const handleSignOut = async () => {
    console.log('[AdminLogin] signing out…');
    await signOut();
  };

  let content: React.ReactNode;

  if (!isLoaded || checking || (isSignedIn && !unauthorized)) {
    content = <Loader size="lg" />;
  } else if (!isSignedIn) {
    content = (
      <SignIn
        routing="hash"
        signUpUrl=""
        fallbackRedirectUrl="/admin-login"
        appearance={adminSignInAppearance}
      />
    );
  } else {
    content = (
      <Stack align="center" gap="md">
        <Alert
          icon={<AlertCircle size={16} />}
          title="Obehörig"
          color="red"
        >
          Du har inte administratörsbehörighet. Kontakta en befintlig administratör om du behöver åtkomst.
        </Alert>
        <Button
          leftSection={<LogOut size={16} />}
          variant="outline"
          color="red"
          onClick={handleSignOut}
        >
          Logga ut från nuvarande konto
        </Button>
      </Stack>
    );
  }

  return (
    <div style={PAGE}>
      <div style={INNER}>
        {content}
      </div>
    </div>
  );
}