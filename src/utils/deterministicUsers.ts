import type { User } from '../api/users';

/**
 * SIMPLE CACHE (in-memory)
 */
const eventUsersCache = new Map<
  string,
  {
    host: User | null;
    participants: User[];
  }
>();

/**
 * Beräkna host-index deterministiskt baserat på event ID
 */
export function getHostIndex(eventId: number, userCount: number): number {
  if (userCount === 0) return -1;
  const hash = Math.abs(((eventId * 73856093) ^ (eventId * 19349663)) >>> 0);
  return hash % userCount;
}

/**
 * Participant index
 */
export function getParticipantIndex(
  eventId: number,
  participantNumber: number,
  userCount: number,
): number {
  if (userCount === 0) return -1;

  const hash = Math.abs(
    ((eventId * 73856093) ^ (participantNumber * 19349663)) >>> 0,
  );

  return hash % userCount;
}

/**
 * Host
 */
export function getDeterministicHost(
  eventId: number,
  users: User[],
): User | null {
  if (!users?.length) return null;

  const hostIndex = getHostIndex(eventId, users.length);
  if (hostIndex < 0 || hostIndex >= users.length) return null;

  return users[hostIndex] ?? null;
}

/**
 * Participants
 */
export function getDeterministicParticipants(
  eventId: number,
  participantCount: number,
  users: User[],
): User[] {
  if (!users?.length) return [];

  const hostIndex = getHostIndex(eventId, users.length);
  const numParticipants = Math.min(participantCount || 0, users.length);

  const participantsList: User[] = [];

  for (let i = 0; i < numParticipants; i++) {
    const participantIndex = getParticipantIndex(eventId, i, users.length);

    if (participantIndex < 0 || participantIndex >= users.length) continue;
    if (participantIndex === hostIndex) continue;

    const participant = users[participantIndex];

    if (participant && !participantsList.find((p) => p.id === participant.id)) {
      participantsList.push(participant);
    }
  }

  return participantsList;
}

/**
 * 🔥 CACHED VERSION (MAIN FIX)
 */
export function getEventUsers(
  eventId: number,
  users: User[],
  participantCount: number,
) {
  const key = `${eventId}-${users.length}-${participantCount}`;

  const cached = eventUsersCache.get(key);
  if (cached) return cached;

  const result = {
    host: getDeterministicHost(eventId, users),
    participants: getDeterministicParticipants(
      eventId,
      participantCount,
      users,
    ),
  };

  eventUsersCache.set(key, result);

  return result;
}

/**
 * host check
 */
export function isUserHosting(
  userId: number,
  eventId: number,
  users: User[],
): boolean {
  if (!users?.length) return false;

  const hostIndex = getHostIndex(eventId, users.length);
  if (hostIndex < 0 || hostIndex >= users.length) return false;

  return users[hostIndex]?.id === userId;
}

/**
 * participant check
 */
export function isUserParticipating(
  userId: number,
  eventId: number,
  participantCount: number,
  users: User[],
): boolean {
  if (!users?.length) return false;

  if (isUserHosting(userId, eventId, users)) return false;

  const participants = getDeterministicParticipants(
    eventId,
    participantCount,
    users,
  );

  return participants.some((p) => p.id === userId);
}
