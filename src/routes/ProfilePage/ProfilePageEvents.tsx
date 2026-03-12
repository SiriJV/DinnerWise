import { Tabs, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { EventType } from '../../types/EventType';
import { useAuth } from '../../contexts/AuthContext';
import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';
import { useNavigationType } from 'react-router-dom';

type ProfilePageEventsProps = {
  userId: number;
};

export default function ProfilePageEvents({ userId }: ProfilePageEventsProps) {
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks } = useAuth();

  const navigationType = useNavigationType();

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsRes, usersRes] = await Promise.all([
          fetch('http://localhost:3001/events'),
          fetch('http://localhost:3001/users'),
        ]);
        const events: EventType[] = await eventsRes.json();
        const users: any[] = await usersRes.json();
        setAllEvents(events);
        setAllUsers(users);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const TAB_STORAGE_KEY = `profile_active_tab_${userId}`;

  const [activeTab, setActiveTab] = useState<string | null>(() => {
    const storedTab = sessionStorage.getItem(TAB_STORAGE_KEY);
    return storedTab || 'hosting';
  });

  useEffect(() => {
    if (navigationType === 'POP' && activeTab) {
      sessionStorage.setItem(TAB_STORAGE_KEY, activeTab);
    }
  }, [activeTab, navigationType]);

  const userIndex = allUsers.findIndex((u) => u.id === userId);

  const hostingEvents = allEvents.filter((event) => {
    if (!allUsers.length) return false;
    const hostIndex = event.id % allUsers.length;
    return hostIndex === userIndex;
  });

  const participatingEvents = allEvents.filter((event) => {
    if (!allUsers.length) return false;
    const hostIndex = event.id % allUsers.length;
    if (hostIndex === userIndex) return false;
    const numParticipants = Math.min(3 + (event.id % 3), allUsers.length);
    for (let i = 0; i < numParticipants; i++) {
      const participantIndex = (event.id * 7 + i * 13) % allUsers.length;
      if (participantIndex === userIndex) return true;
    }
    return false;
  });

  const savedEvents = allEvents.filter((e) => bookmarks.includes(e.id));

  if (loading) {
    return <Text mt='md'>Laddar events...</Text>;
  }

  return (
    <>
      <Title order={3}>Event</Title>
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value!)}>
        {' '}
        <Tabs.List mb='md'>
          <Tabs.Tab value='hosting' color='black'>
            Värd för ({hostingEvents.length})
          </Tabs.Tab>
          <Tabs.Tab value='participating' color='black'>
            Deltagare i ({participatingEvents.length})
          </Tabs.Tab>
          <Tabs.Tab value='saved' color='black'>
            Sparade ({bookmarks.length})
          </Tabs.Tab>
          <Tabs.Tab value='past' color='black'>
            Tidigare (0)
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='hosting'>
          {hostingEvents.length === 0 ? (
            <Text mt='md' c='dimmed'>
              Inga event som värd ännu.
            </Text>
          ) : (
            <PaginatedEventGrid
              events={hostingEvents.map((e) => ({ ...e, isHost: true }))}
              pageSize={6}
              paginationKey={`profile_hosting_${userId}`}
              navigationType={navigationType}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value='participating'>
          {participatingEvents.length === 0 ? (
            <Text mt='md' c='dimmed'>
              Inga event som deltagare ännu.
            </Text>
          ) : (
            <PaginatedEventGrid
              events={participatingEvents}
              pageSize={6}
              paginationKey={`profile_participating_${userId}`}
              navigationType={navigationType}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value='saved'>
          {savedEvents.length === 0 ? (
            <Text mt='md' c='dimmed'>
              Inga sparade event ännu.
            </Text>
          ) : (
            <PaginatedEventGrid
              events={savedEvents}
              pageSize={6}
              paginationKey={`profile_saved_${userId}`}
              navigationType={navigationType}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value='past'>
          <Text mt='md' c='dimmed'>
            Inga tidigare event ännu.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
