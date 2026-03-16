import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Text,
  Stack,
  Slider,
  Textarea,
  Button,
  Box,
  Rating,
  Group,
  Center,
  Radio,
  MantineThemeProvider,
} from '@mantine/core';

import type { EventType } from '../../types/EventType';
import ModalEventInfo from '../../components/Modals/ModalEventInfo/ModalEventInfo';

export default function EventFeedback(): React.ReactNode {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  const [accurateScore, setAccurateScore] = useState<number | null>(null);
  const [eventScore, setEventScore] = useState<number | null>(null);
  const [hostScore, setHostScore] = useState<number | null>(null);
  const [restaurantScore, setRestaurantScore] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<'yes' | 'no' | null>(null);

  const [accurateFeedback, setAccurateFeedback] = useState('');
  const [eventFeedback, setEventFeedback] = useState('');
  const [hostFeedback, setHostFeedback] = useState('');
  const [restaurantFeedback, setRestaurantFeedback] = useState('');
  const [recommendFeedback, setRecommendFeedback] = useState('');
  const [positiveFeedback, setPositiveFeedback] = useState('');

  const showAccurateFeedback =
    accurateScore === 1 || accurateScore === 2 || accurateScore === 3;
  const showEventFeedback = eventScore !== null && eventScore <= 3;
  const showHostFeedback = hostScore !== null && hostScore <= 3;
  const showRestaurantFeedback = restaurantScore === 1 || restaurantScore === 2;
  const showRecommendFeedback = recommend === 'no';
  const hasPositiveFeedback = recommend === 'yes';
  const [submitted, setSubmitted] = useState(false);

  const location = useLocation();

  const slugMatch = location.pathname.match(/event\/(.+?)-(\d+)/);
  const eventId = slugMatch ? slugMatch[2] : null;

  useEffect(() => {
    async function loadEvent() {
      try {
        if (!eventId) throw new Error('Event ID saknas');

        const res = await fetch(`http://localhost:3001/events/${eventId}`);
        const data = await res.json();

        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Text p='xl' ta='center' c='dimmed'>
        Laddar event...
      </Text>
    );
  }

  if (!event) {
    return (
      <Text p='xl' ta='center' c='red'>
        Event hittades inte
      </Text>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Stack m='md'>
        <Text fw={700} fz='xl'>
          Tack för din feedback!
        </Text>
        <Text c='dimmed'>
          Din feedback hjälper oss att förbättra framtida event.
        </Text>
      </Stack>
    );
  }

  return (
    <Center>
      <Stack m='md' maw={500} gap='lg'>
        <Text fw={700} fz='xl'>
          Lämna feedback på eventet{' '}
          <Text span c='rgba(211, 4, 59, 1)' fw={700} fz='xl'>
            {event.title}
          </Text>
        </Text>
        <ModalEventInfo
          event={event}
          showPrice={false}
          showTitle={false}
          showDescription={true}
        />

        <form onSubmit={handleSubmit}>
          <Stack gap='xl'>
            <Box mb='md'>
              <Text size='md' mb='xs' fw={600}>
                Hur väl stämde eventet överens med beskrivningen?
              </Text>

              <Slider
                min={1}
                max={5}
                step={1}
                label={null}
                value={accurateScore ?? 1}
                onChange={setAccurateScore}
                marks={[
                  { value: 1 },
                  { value: 2 },
                  { value: 3 },
                  { value: 4 },
                  { value: 5 },
                ]}
              />

              <Group w='100%' mt={4}>
                <Text
                  size='xs'
                  c='dimmed'
                  style={{ flex: 1, textAlign: 'left' }}>
                  Inte alls
                </Text>
                <Text
                  size='xs'
                  c='dimmed'
                  style={{ flex: 1, textAlign: 'center' }}>
                  Delvis
                </Text>
                <Text
                  size='xs'
                  c='dimmed'
                  style={{ flex: 1, textAlign: 'right' }}>
                  Helt
                </Text>
              </Group>

              {showAccurateFeedback && (
                <Textarea
                  mt='md'
                  label={
                    <Text fw={600} size='sm'>
                      Vad stämde inte överens med beskrivningen?{' '}
                    </Text>
                  }
                  placeholder='T.ex. upplägg, innehåll, tidsplan eller något annat som inte motsvarade dina förväntningar.'
                  value={accurateFeedback}
                  onChange={(e) => setAccurateFeedback(e.target.value)}
                  minRows={3}
                />
              )}
            </Box>

            <Box mb='md'>
              <Text size='md' mb='xs' fw={600}>
                Hur var restaurangen?
              </Text>
              <Slider
                min={1}
                max={5}
                label={null}
                value={restaurantScore ?? 1}
                onChange={setRestaurantScore}
                marks={[
                  { value: 1 },
                  { value: 2 },
                  { value: 3 },
                  { value: 4 },
                  { value: 5 },
                ]}
              />
              <Group w='100%' mt={4}>
                <Text
                  size='xs'
                  c='dimmed'
                  style={{ flex: 1, textAlign: 'left' }}>
                  Dålig{' '}
                </Text>
                <Text
                  size='xs'
                  c='dimmed'
                  style={{ flex: 1, textAlign: 'center' }}>
                  Bra
                </Text>
                <Text
                  size='xs'
                  c='dimmed'
                  style={{ flex: 1, textAlign: 'right' }}>
                  Fantastisk
                </Text>
              </Group>
              {showRestaurantFeedback && (
                <Textarea
                  mt='md'
                  label={
                    <Text fw={600} size='sm'>
                      Vad var mindre bra med restaurangen?
                    </Text>
                  }
                  placeholder='T.ex. maten, servicen, ljudnivån eller miljön.'
                  value={restaurantFeedback}
                  onChange={(e) => setRestaurantFeedback(e.target.value)}
                  minRows={3}
                />
              )}
            </Box>

            <Box mb='md'>
              <Text size='md' mb='xs' fw={600}>
                Betygsätt eventet
              </Text>
              <Rating
                value={eventScore ?? 0}
                onChange={setEventScore}
                color='rgba(211, 4, 59, 1)'
              />
              {showEventFeedback && (
                <Textarea
                  mt='md'
                  label={
                    <Text fw={600} size='sm'>
                      Vad saknades eller kunde varit bättre under eventet?{' '}
                    </Text>
                  }
                  placeholder='T.ex. samtalsämnet, stämningen, tempot eller upplägg.'
                  value={eventFeedback}
                  onChange={(e) => setEventFeedback(e.target.value)}
                  minRows={3}
                />
              )}
            </Box>

            <Box mb='md'>
              <Text size='md' mb='xs' fw={600}>
                Betygsätt värden{' '}
              </Text>
              <Rating
                value={hostScore ?? 0}
                onChange={setHostScore}
                color='rgba(211, 4, 59, 1)'
              />
              {showHostFeedback && (
                <Textarea
                  mt='md'
                  label={
                    <Text fw={600} size='sm'>
                      Hur kunde värden gjort upplevelsen bättre?{' '}
                    </Text>
                  }
                  placeholder='T.ex. information, bemötande, engagemang eller organisering.'
                  value={hostFeedback}
                  onChange={(e) => setHostFeedback(e.target.value)}
                  minRows={3}
                />
              )}
            </Box>

            <Box mb='md'>
              <Radio.Group
                label={
                  <Text size='md' fw={600}>
                    Skulle du rekommendera eventet till en vän?{' '}
                  </Text>
                }
                value={recommend ?? undefined}
                onChange={(value) => setRecommend(value as 'yes' | 'no')}>
                <Group mt='xs'>
                  <MantineThemeProvider>
                    <Radio
                      value='yes'
                      label='Ja'
                      style={{ label: { cursor: 'pointer' } }}
                    />
                    <Radio
                      value='no'
                      label='Nej'
                      style={{ label: { cursor: 'pointer' } }}
                    />
                  </MantineThemeProvider>
                </Group>
              </Radio.Group>

              {showRecommendFeedback && (
                <Textarea
                  mt='md'
                  label={
                    <Text fw={600} size='sm'>
                      Vad skulle behöva förändras för att du skulle rekommendera
                      eventet?{' '}
                    </Text>
                  }
                  placeholder='Vad skulle behöva förbättras eller ändras för att du skulle rekommendera eventet till en vän?'
                  value={recommendFeedback}
                  onChange={(e) => setRecommendFeedback(e.target.value)}
                  minRows={3}
                />
              )}

              {hasPositiveFeedback && (
                <Textarea
                  mt='md'
                  label={
                    <Text fw={600} size='sm'>
                      Vad gjorde upplevelsen särskilt bra eller minnesvärd?{' '}
                    </Text>
                  }
                  placeholder='T.ex. något som överraskade dig, något du uppskattade extra mycket eller något som gjorde att du kände dig glad under eventet.'
                  value={positiveFeedback}
                  onChange={(e) => setPositiveFeedback(e.target.value)}
                  minRows={3}
                />
              )}
            </Box>

            <Button type='submit' color='red'>
              Skicka feedback
            </Button>
          </Stack>
        </form>
      </Stack>
    </Center>
  );
}
