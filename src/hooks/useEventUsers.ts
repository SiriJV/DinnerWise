import { useState, useEffect } from 'react';
import { fetchUsers, type User } from '../api/users';

export default function useEventUsers(
  id: number,
  current_participants: number,
) {
  const [host, setHost] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const data = await fetchUsers();

      // Deterministic host based on event ID
      const hostIndex = id % data.length;
      setHost(data[hostIndex]);

      // Deterministic participants based on event ID and current_participants
      const numParticipants = Math.min(current_participants || 0, data.length);
      const participantsList: User[] = [];
      for (let i = 0; i < numParticipants; i++) {
        const participantIndex = (id * 7 + i * 13) % data.length;
        if (!participantsList.find((p) => p.id === data[participantIndex].id)) {
          participantsList.push(data[participantIndex]);
        }
      }
      setParticipants(participantsList);
    }

    loadUsers();
  }, [id, current_participants]);

  return { host, participants };
}
