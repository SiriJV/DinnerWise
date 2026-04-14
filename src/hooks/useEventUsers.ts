import { useState, useEffect } from 'react';
import { fetchUsers, type User } from '../api/users';
import { getEventUsers } from '../utils/deterministicUsers';

export default function useEventUsers(id: number, max_participants: number) {
  const [host, setHost] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);

      const data = await fetchUsers();

      const { host, participants } = getEventUsers(id, data, max_participants);

      setHost(host);
      setParticipants(participants);
      setLoading(false);
    }

    loadUsers();
  }, [id, max_participants]);

  return { host, participants, loading };
}
