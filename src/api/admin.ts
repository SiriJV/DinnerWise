import type { AccountUser } from './clerkApi';
import type { Event } from './events';
import { API_URL, unwrapApiResponse, unwrapApiErrorMessage } from './config';

const API_BASE = API_URL;

function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (!token) throw new Error('Auth token krävs');
  headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/**
 * Hämta alla account_users
 */
export async function fetchAdminUsers(token: string): Promise<AccountUser[]> {
  const url = `${API_URL}/admin/users`;
  const res = await fetch(url, {
    headers: getAuthHeaders(token),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Kunde inte hämta användare');
  }
  const payload = unwrapApiResponse<AccountUser[]>(await res.json());
  return payload;
}

/**
 * Hämta alla events
 */
export async function fetchAdminEvents(token: string): Promise<Event[]> {
  const url = `${API_URL}/admin/events`;
  const res = await fetch(url, {
    headers: getAuthHeaders(token),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Kunde inte hämta events');
  }
  const payload = unwrapApiResponse<Event[]>(await res.json());
  return payload;
}

export interface ReportedEvent {
  report_id: number;
  event_id: number;
  reported_by_account_user_id: number | null;
  reason: string | null;
  status: string;
  created_at: string;
  event_title: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string | null;
  event_description: string | null;
  event_price: number | string | null;
  event_current_participants: number | null;
  event_max_participants: number | null;
  restaurant_id: number | null;
  restaurant_name: string | null;
  restaurant_address: string | null;
  restaurant_city: string | null;
  category_id: number | null;
  category_name: string | null;
  reporter_email: string | null;
  reporter_first_name: string | null;
  reporter_last_name: string | null;
}

export interface AdminEventDetails {
  id: number;
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  price: number | string | null;
  current_participants: number | null;
  max_participants: number | null;
  restaurant_id: number | null;
  restaurant_name: string | null;
  restaurant_address: string | null;
  restaurant_city: string | null;
  category_id: number | null;
  category_name: string | null;
}

export interface ReportedUser {
  report_id: number;
  reported_account_user_id: number;
  reported_by_account_user_id: number | null;
  reason: string | null;
  created_at: string;
  reported_user_email: string;
  reported_user_role: 'user' | 'admin';
  reported_user_first_name: string | null;
  reported_user_last_name: string | null;
  reported_user_clerk_user_id: string | null;
  reporter_email: string | null;
}

/**
 * Hämta alla rapporterade events
 */
export async function fetchAdminReportedEvents(token: string): Promise<ReportedEvent[]> {
  const url = `${API_BASE}/admin/reported-events`;
  const res = await fetch(url, {
    headers: getAuthHeaders(token),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Kunde inte hämta rapporterade events');
  }
  const payload = unwrapApiResponse<ReportedEvent[]>(await res.json());
  return payload;
}

export async function fetchAdminReportedUsers(token: string): Promise<ReportedUser[]> {
  const url = `${API_BASE}/admin/reported-users`;
  const res = await fetch(url, {
    headers: getAuthHeaders(token),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Kunde inte hämta rapporterade användare');
  }

  const data = unwrapApiResponse<ReportedUser[]>(await res.json());
  return data;
}

export async function fetchAdminEventDetails(
  eventId: number,
  token: string,
): Promise<AdminEventDetails> {
  const url = `${API_BASE}/admin/events/${eventId}`;
  const res = await fetch(url, {
    headers: getAuthHeaders(token),
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(unwrapApiErrorMessage(data) || 'Kunde inte hämta eventet');
  }
  return unwrapApiResponse<AdminEventDetails>(data);
}

export async function deleteAdminEvent(
  eventId: number,
  token: string,
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE}/admin/events/${eventId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(unwrapApiErrorMessage(data) || 'Kunde inte ta bort eventet');
  }
  return { success: true, ...unwrapApiResponse<{ message: string }>(data) };
}

export async function dismissAdminReport(
  reportId: number,
  token: string,
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE}/admin/event-reports/${reportId}`;
  const method = 'DELETE';
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(token),
    credentials: 'include',
  });

  const responseText = await res.text();
  let data: any = {};
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(unwrapApiErrorMessage(data) || 'Kunde inte avfärda rapporten');
  }

  return { success: true, ...unwrapApiResponse<{ message: string }>(data) };
}

export async function dismissAdminUserReport(
  reportId: number,
  token: string,
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE}/admin/user-reports/${reportId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(unwrapApiErrorMessage(data) || 'Kunde inte avfärda rapporten');
  }
  return { success: true, ...unwrapApiResponse<{ message: string }>(data) };
}

export async function deleteAdminUser(
  userId: number,
  token: string,
): Promise<{ success: boolean; message: string }> {
  const url = `${API_BASE}/admin/users/${userId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(unwrapApiErrorMessage(data) || 'Kunde inte ta bort användaren');
  }
  return { success: true, ...unwrapApiResponse<{ message: string }>(data) };
}

export interface InviteResult {
  success: boolean;
  message: string;
  invitation?: {
    id: string;
    email: string;
    status: string;
  };
}

/**
 * Bjud in en ny admin via Clerk invitation
 */
export async function inviteAdmin(
  emailAddress: string,
  token: string,
): Promise<InviteResult> {
  const res = await fetch(`${API_BASE}/admin/invitations`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    credentials: 'include',
    body: JSON.stringify({ emailAddress }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(unwrapApiErrorMessage(data) || 'Kunde inte skicka inbjudan');
  }
  return { success: true, ...unwrapApiResponse<{ message: string; invitation?: InviteResult['invitation'] }>(data) };
}