import type { User } from '../api/users';

/**
 * Beräkna host-index deterministiskt baserat på event ID
 * Använder en bättre hash-funktion för mer variation mellan events
 */
export function getHostIndex(eventId: number, userCount: number): number {
  if (userCount === 0) return -1;
  // Multiplicera med olika primtal för bättre distribution
  // Använd bitwise AND för att hålla tal inom range
  const hash = Math.abs(((eventId * 73856093) ^ (eventId * 19349663)) >>> 0);
  return hash % userCount;
}

/**
 * Beräkna participant-index för ett specifikt deltagare-nummer
 * Använder en mer random-känsla distribution
 */
export function getParticipantIndex(
  eventId: number,
  participantNumber: number,
  userCount: number,
): number {
  if (userCount === 0) return -1;
  // Kombinera event ID och participant nummer för unik index
  const hash = Math.abs(
    ((eventId * 73856093) ^ (participantNumber * 19349663)) >>> 0,
  );
  return hash % userCount;
}

/**
 * Få deterministisk värd baserat på event ID
 */
export function getDeterministicHost(
  eventId: number,
  users: User[],
): User | null {
  if (!users || users.length === 0) return null;
  const hostIndex = getHostIndex(eventId, users.length);
  if (hostIndex < 0 || hostIndex >= users.length) return null;
  return users[hostIndex] || null;
}

/**
 * Få deterministiska deltagare för ett event
 * (exkluderar automatiskt värden så hen inte kan vara deltagare också)
 */
export function getDeterministicParticipants(
  eventId: number,
  participantCount: number,
  users: User[],
): User[] {
  if (!users || users.length === 0) return [];

  const hostIndex = getHostIndex(eventId, users.length);
  const numParticipants = Math.min(participantCount || 0, users.length);
  const participantsList: User[] = [];

  for (let i = 0; i < numParticipants; i++) {
    const participantIndex = getParticipantIndex(eventId, i, users.length);

    // Validera index
    if (participantIndex < 0 || participantIndex >= users.length) continue;

    // Skip if this is the host
    if (participantIndex === hostIndex) continue;

    const participant = users[participantIndex];
    if (participant && !participantsList.find((p) => p.id === participant.id)) {
      participantsList.push(participant);
    }
  }

  return participantsList;
}

/**
 * Få både värd och deltagare för ett event
 */
export function getEventUsers(
  eventId: number,
  users: User[],
  participantCount: number,
) {
  return {
    host: getDeterministicHost(eventId, users),
    participants: getDeterministicParticipants(
      eventId,
      participantCount,
      users,
    ),
  };
}

/**
 * Kontrollera om användare är värd för ett event
 */
export function isUserHosting(
  userId: number,
  eventId: number,
  users: User[],
): boolean {
  if (!users || users.length === 0) return false;
  const hostIndex = getHostIndex(eventId, users.length);
  if (hostIndex < 0 || hostIndex >= users.length) return false;
  const host = users[hostIndex];
  return host?.id === userId;
}

/**
 * Kontrollera om användare är deltagare i ett event
 */
export function isUserParticipating(
  userId: number,
  eventId: number,
  participantCount: number,
  users: User[],
): boolean {
  if (!users || users.length === 0) return false;
  // Värd kan inte vara deltagare också
  if (isUserHosting(userId, eventId, users)) return false;

  const participants = getDeterministicParticipants(
    eventId,
    participantCount,
    users,
  );
  return participants.some((p) => p.id === userId);
}
