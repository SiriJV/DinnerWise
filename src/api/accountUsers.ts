import { API_URL, unwrapApiResponse } from './config';

export async function resolveReportableAccountUserId(
  alias: string,
  legacyUserId: number,
  name?: string,
): Promise<number | null> {
  const params = new URLSearchParams();
  params.set('alias', alias);
  params.set('legacyUserId', String(legacyUserId));
  if (name) params.set('name', name);

  const url = `${API_URL}/account-users/resolve-target?${params.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = unwrapApiResponse<{ accountUserId: number; source: string }>(
    await res.json()
  );
  const id = Number(data?.accountUserId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function reportUser(
  userId: number,
  token?: string | null,
): Promise<{ success: boolean; message: string }> {
  const url = `${API_URL}/users/${userId}/report`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ reason: null }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(body || 'Kunde inte rapportera användaren');
  }

  if (!body) {
    return { success: true, message: 'OK' };
  }

  const parsed = JSON.parse(body);
  if (parsed?.data?.message) {
    return { success: true, message: parsed.data.message };
  }

  return parsed;
}