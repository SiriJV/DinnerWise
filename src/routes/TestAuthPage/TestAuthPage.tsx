import { useEffect } from 'react';
import { useAuth, SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Title, Text, Center, Loader } from '@mantine/core';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import { clerkAuthAppearance } from '../../components/AuthLayout/clerkAppearance';

export default function TestAuthPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const params = new URLSearchParams(window.location.search);
      const hasTicket = params.has('__clerk_ticket');
      const pendingInvitation = sessionStorage.getItem('pending_invitation_flow');

      if (hasTicket || pendingInvitation) {
        console.log(
          '[redirect] NOT going to /test-account — invitation flow detected.',
          { hasTicket, pendingInvitation },
        );
        sessionStorage.removeItem('pending_invitation_flow');
        navigate('/accept-invitation' + window.location.search, { replace: true });
        return;
      }

      console.log('[redirect] going to /test-account because user is signed in on /test-auth');
      navigate('/test-account');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <AuthLayout>
        <Center mih={200}>
          <Loader />
        </Center>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Title order={2} ta="center">Logga in</Title>
      <Text ta="center" c="dimmed" size="sm">
        Logga in för att komma åt ditt konto.
      </Text>

      <SignIn
        routing="hash"
        signUpUrl="/test-auth"
        fallbackRedirectUrl="/test-account"
        forceRedirectUrl="/test-account"
        appearance={clerkAuthAppearance}
      />
    </AuthLayout>
  );
}