import { Tabs, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { EventType } from '../../types/EventType';
import { useAuth } from '../../contexts/AuthContext';
import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';
import { useNavigationType, useSearchParams } from 'react-router-dom';
import {
  isUserHosting,
  isUserParticipating,
} from '../../utils/deterministicUsers';

type ProfilePageEventsProps = {
  userId: number;
};

export default function ProfilePageEvents({ userId }: ProfilePageEventsProps) {
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks, user: authUser } = useAuth();
  const [params, setParams] = useSearchParams();

  const navigationType = useNavigationType();
  const [activeTab, setActiveTab] = useState<string | null>('hosting');

  // Always reset to first tab on new profile
  useEffect(() => {
    setActiveTab('hosting');
  }, [userId]);

  function handleTabChange(tab: string | null) {
    setActiveTab(tab);
    // Clear page parameter when switching tabs
    const newParams = new URLSearchParams(params);
    newParams.delete('page');
    setParams(newParams);
  }

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

  useEffect(() => {
    if (navigationType === 'POP' && activeTab) {
      sessionStorage.setItem(TAB_STORAGE_KEY, activeTab);
    }
  }, [activeTab, navigationType]);

  const hostingEvents = allEvents.filter((event) => {
    return isUserHosting(userId, event.id, allUsers);
  });

  const participatingEvents = allEvents.filter((event) => {
    return isUserParticipating(
      userId,
      event.id,
      event.current_participants,
      allUsers,
    );
  });

  const savedEvents = allEvents.filter((e) => bookmarks.includes(e.id));

  if (loading) {
    return <Text mt='md'>Laddar events...</Text>;
  }

  return (
    <>
      <Title order={3}>Event</Title>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tabs.List mb='md'>
          <Tabs.Tab value='hosting' color='black'>
            Värd för ({hostingEvents.length})
          </Tabs.Tab>
          <Tabs.Tab value='participating' color='black'>
            Deltagare i ({participatingEvents.length})
          </Tabs.Tab>
          {authUser && userId === authUser.id && (
            <Tabs.Tab value='saved' color='black'>
              Sparade ({bookmarks.length})
            </Tabs.Tab>
          )}
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
              events={hostingEvents}
              pageSize={6}
              loading={loading}
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
              loading={loading}
            />
          )}
        </Tabs.Panel>
        {authUser && userId === authUser.id && (
          <Tabs.Panel value='saved'>
            {savedEvents.length === 0 ? (
              <Text mt='md' c='dimmed'>
                Inga sparade event ännu.
              </Text>
            ) : (
              <PaginatedEventGrid
                events={savedEvents}
                pageSize={6}
                loading={loading}
              />
            )}
          </Tabs.Panel>
        )}
        <Tabs.Panel value='past'>
          <Text mt='md' c='dimmed'>
            Inga tidigare event ännu.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
