import { Container, Title, Text, Button, Stack, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchEventById } from '../../api/events';
import type { Event } from '../../api/events';
import { generateEventSlug } from '../../utils/slugify';
import { APP_CONFIG } from '../../config/appConfig';

export default function RestaurantAcceptancePage(): React.ReactNode {
  const [approved, setApproved] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get('eventId'));

  function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  useEffect(() => {
    if (eventId) {
      fetchEventById(eventId).then(setEvent);
    }
  }, [eventId]);

  async function sendAcceptanceEmail() {
    if (!event) return;
    await fetch('http://localhost:3001/email/send-confirmation-email-to-host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: event.restaurant_name,
        date: event.date,
        event: event.title,
        participants: event.max_participants,
        eventId: event.id,
        name: 'Anna Svensson (demo)', // Replace with actual host name if available
        path: `http://localhost:5173/event/${generateEventSlug(event.title, event.id)}`,
      }),
    });
  }

  const handleApprove = () => {
    setApproved(true);
    sendAcceptanceEmail();
  };

  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Hantera bokning
        </Title>
        {event ? (
          <>
            <Stack>
              <Text size='lg' fw={400}>
                Hantera bokning för{' '}
                <Text span fw={800}>
                  {event.title} (Event-ID: {event.id})
                </Text>{' '}
                på{' '}
                <Text span fw={800}>
                  {event.restaurant_name}
                </Text>
                .
              </Text>
              <Text>
                {' '}
                <Text span fw={800}>
                  Beskrivning:
                </Text>{' '}
                {event.description}
              </Text>
              <Text>
                {' '}
                <Text span fw={800}>
                  Datum:
                </Text>{' '}
                {formatDate(event.date)}
              </Text>
              <Text>
                {' '}
                <Text span fw={800}>
                  Tid:
                </Text>{' '}
                {event.start_time.slice(0, 5)}-{event.end_time.slice(0, 5)}
              </Text>
              <Text>
                {' '}
                <Text span fw={800}>
                  Antal:
                </Text>{' '}
                {event.max_participants} personer
              </Text>
              <Text>
                {' '}
                <Text span fw={800}>
                  Namn:
                </Text>{' '}
                {APP_CONFIG.exampleUserFirstName}{' '}
                {APP_CONFIG.exampleUserLastName}{' '}
              </Text>
              <Text>
                {' '}
                <Text span fw={800}>
                  Telefonnummer:
                </Text>{' '}
                {APP_CONFIG.exampleUserTelephone}{' '}
              </Text>
              <Text>
                {' '}
                <Text span fw={800}>
                  Epost:
                </Text>{' '}
                {APP_CONFIG.exampleUserEmail}{' '}
              </Text>

              {approved ? (
                <Group>
                  <Text fw={800}>Godkänt!</Text>
                  <Button>Avvisa eller ändra bokning</Button>
                </Group>
              ) : (
                <Group>
                  <Button onClick={handleApprove}>Godkänn bokning</Button>
                  <Button variant='outline'>Avvisa eller ändra bokning</Button>
                </Group>
              )}
            </Stack>
          </>
        ) : (
          <Text>Laddar event...</Text>
        )}
      </Container>
    </>
  );
}
