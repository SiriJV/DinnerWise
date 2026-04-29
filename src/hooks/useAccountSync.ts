/**
 * useAccountSync — ensures the signed-in Clerk user has a row in `account_users`.
*/

import { useEffect, useRef } from 'react';
import { useAuth, useSession } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import { clerkApi } from '../api/clerkApi';

/** Routes where global account sync must not run */
const SYNC_EXCLUDED_ROUTES = ['/accept-invitation'];

export function useAccountSync() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { session } = useSession();
  const location = useLocation();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (SYNC_EXCLUDED_ROUTES.includes(location.pathname)) {
      console.log(`[useAccountSync] Sync SKIPPED — current route is ${location.pathname}`);
      return;
    }

    if (!isLoaded || !isSignedIn || !session || !userId) return;
    if (syncedUserId.current === userId) return;

    let cancelled = false;

    (async () => {
      try {
        const token = await session.getToken();
        if (!token || cancelled) return;

        console.log('[useAccountSync] Requesting current account for userId:', userId);
        const account = await clerkApi.getCurrentAccount(token);

        const hasLocalId = !!account?.id;
        console.log('[useAccountSync] Sync result:', {
          localId: account?.id ?? null,
          hasLocalId,
          email: account?.email,
          role: account?.role,
          clerk_user_id: account?.clerk_user_id,
        });

        if (!hasLocalId) {
          console.warn('[useAccountSync] WARNING: response did not contain a local id — sync may have failed');
        }

        if (!cancelled) {
          syncedUserId.current = userId;
        }
      } catch (err) {
        console.warn('[useAccountSync] Sync failed (non-critical):', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, session, userId, location.pathname]);
}