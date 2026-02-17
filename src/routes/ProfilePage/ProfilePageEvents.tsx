import { SimpleGrid, Tabs, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard/EventCard';
import type { EventType } from '../../types/EventType';
import { useAuth } from '../../contexts/AuthContext';

type ProfilePageEventsProps = {
  userId: number;
};

export default function ProfilePageEvents({ userId }: ProfilePageEventsProps) {
  const [activeTab, setActiveTab] = useState<string | null>('hosting');
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks } = useAuth();

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

  // Find the user's index in the users array (same as EventCard/EventDetails)
  const userIndex = allUsers.findIndex((u) => u.id === userId);

  // Deterministiskt välja events där användaren är värd (samma logik som EventCard/EventDetails)
  const hostingEvents = allEvents.filter((event) => {
    if (allUsers.length === 0) return false;
    const hostIndex = event.id % allUsers.length;
    return hostIndex === userIndex;
  });

  // Deterministiskt välja events där användaren är deltagare (samma logik som EventCard/EventDetails)
  const participatingEvents = allEvents.filter((event) => {
    if (allUsers.length === 0) return false;

    // Check if user is host first
    const hostIndex = event.id % allUsers.length;
    const isHost = hostIndex === userIndex;
    if (isHost) return false;

    // Check if user is selected as participant (same algorithm as EventCard)
    const numParticipants = Math.min(3 + (event.id % 3), allUsers.length);
    for (let i = 0; i < numParticipants; i++) {
      const participantIndex = (event.id * 7 + i * 13) % allUsers.length;
      if (participantIndex === userIndex) {
        return true;
      }
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
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
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
            Tidigare
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='hosting'>
          {hostingEvents.length === 0 ? (
            <Text mt='md' c='dimmed'>
              Inga event som värd ännu.
            </Text>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
              spacing='md'
              mt='md'>
              {hostingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  current_participants={event.current_participants}
                  max_participants={event.max_participants}
                  price={event.price}
                  date={new Date(event.date)}
                  start_time={event.start_time}
                  end_time={event.end_time}
                  restaurant_id={event.restaurant_id}
                  restaurant_name={event.restaurant_name}
                  restaurant_address={event.restaurant_address}
                />
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value='participating'>
          {participatingEvents.length === 0 ? (
            <Text mt='md' c='dimmed'>
              Inga event som deltagare ännu.
            </Text>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
              spacing='md'
              mt='md'>
              {participatingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  current_participants={event.current_participants}
                  max_participants={event.max_participants ?? 0}
                  price={event.price}
                  date={new Date(event.date)}
                  start_time={event.start_time}
                  end_time={event.end_time}
                  restaurant_id={event.restaurant_id}
                  restaurant_name={event.restaurant_name}
                  restaurant_address={event.restaurant_address}
                />
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value='saved'>
          {savedEvents.length === 0 ? (
            <Text mt='md' c='dimmed'>
              Inga sparade event ännu.
            </Text>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
              spacing='md'
              mt='md'>
              {savedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  current_participants={event.current_participants}
                  max_participants={event.max_participants ?? 0}
                  price={event.price}
                  date={new Date(event.date)}
                  start_time={event.start_time}
                  end_time={event.end_time}
                  restaurant_id={event.restaurant_id}
                  restaurant_name={event.restaurant_name}
                  restaurant_address={event.restaurant_address}
                />
              ))}
            </SimpleGrid>
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
