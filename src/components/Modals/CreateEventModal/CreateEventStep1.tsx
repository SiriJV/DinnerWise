import { useState } from 'react';
import {
  Textarea,
  Select,
  Group,
  Stack,
  Text,
  Alert,
  MultiSelect,
  Popover,
  ActionIcon,
  Center,
  Button,
} from '@mantine/core';
import { AlertCircle, Sparkles } from 'lucide-react';
import { geminiApi } from '../../../api/gemini';

interface EventDetails {
  title: string;
  category: string | null;
  description: string;
  tags: string[];
}

interface CreateEventStep1Props {
  eventDetails: EventDetails;
  setEventDetails: (details: EventDetails) => void;
  categoryOptions: Array<{ value: string; label: string }>;
  tagOptions: Array<{ value: string; label: string }>;
  errors: string[];
  isLoading: boolean;
}

export default function CreateEventStep1({
  eventDetails,
  setEventDetails,
  categoryOptions,
  tagOptions,
  errors,
  isLoading,
}: CreateEventStep1Props) {
  const [aiTitlePopoverOpened, setAiTitlePopoverOpened] = useState(false);
  const [aiDescPopoverOpened, setAiDescPopoverOpened] = useState(false);
  const [aiTitleLoading, setAiTitleLoading] = useState(false);
  const [aiDescLoading, setAiDescLoading] = useState(false);
  const [aiTitleError, setAiTitleError] = useState('');
  const [aiDescError, setAiDescError] = useState('');

  const descriptionWordCount = eventDetails.description
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const titleWordCount = eventDetails.title
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const aiTitleEnabled = titleWordCount >= 1 && descriptionWordCount >= 1;
  const aiDescriptionEnabled = descriptionWordCount >= 4;

  const setupAiTimeouts = (
    setError: (msg: string) => void,
    setLoading: (loading: boolean) => void,
  ): number[] => {
    const timeoutIds: number[] = [];

    timeoutIds.push(
      setTimeout(() => setError('Vi försöker fortfarande...'), 2000),
    );

    timeoutIds.push(
      setTimeout(
        () => setError('Vi försöker fortfarande, detta kan ta en stund...'),
        20000,
      ),
    );

    timeoutIds.push(
      setTimeout(() => {
        setError('AI-genereringen tog för lång tid. Försök igen senare.');
        setLoading(false);
      }, 40000),
    );

    return timeoutIds;
  };

  const handleAITitle = async () => {
    setAiTitleLoading(true);
    setAiTitleError('');

    const timeoutIds = setupAiTimeouts(setAiTitleError, setAiTitleLoading);

    try {
      const result = await geminiApi.generateEventContent(
        eventDetails.description,
        'event_title',
      );

      timeoutIds.forEach(clearTimeout);

      if (result.success) {
        setEventDetails({ ...eventDetails, title: result.content });
        setAiTitlePopoverOpened(false);
      } else {
        setAiTitleError(result.error || 'Något gick fel med AI-genereringen');
      }
    } catch (err) {
      timeoutIds.forEach(clearTimeout);
      setAiTitleError(
        err instanceof Error
          ? err.message
          : 'Något gick fel med AI-genereringen',
      );
    } finally {
      setAiTitleLoading(false);
    }
  };

  const handleAIDescription = async () => {
    setAiDescLoading(true);
    setAiDescError('');

    const timeoutIds = setupAiTimeouts(setAiDescError, setAiDescLoading);

    try {
      const result = await geminiApi.generateEventContent(
        eventDetails.description,
        'event_description',
      );

      timeoutIds.forEach(clearTimeout);

      if (result.success) {
        setEventDetails({ ...eventDetails, description: result.content });
        setAiDescPopoverOpened(false);
      } else {
        setAiDescError(result.error || 'Något gick fel med AI-genereringen');
      }
    } catch (err) {
      timeoutIds.forEach(clearTimeout);
      setAiDescError(
        err instanceof Error
          ? err.message
          : 'Något gick fel med AI-genereringen',
      );
    } finally {
      setAiDescLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Stack gap='md'>
        <Text c='dimmed'>Laddar kategorier...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap='md'>
      {errors.length > 0 && (
        <Alert
          icon={<AlertCircle size={16} />}
          color='red'
          title='Valideringsfel'>
          <ul style={{ marginLeft: 20 }}>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Textarea
        label='Titel'
        placeholder='Ge ditt event en titel'
        value={eventDetails.title}
        onChange={(e) =>
          setEventDetails({ ...eventDetails, title: e.currentTarget.value })
        }
        required
        autosize
        minRows={1}
        maxRows={2}
        rightSection={
          aiTitleEnabled ? (
            <Popover
              opened={aiTitlePopoverOpened}
              onClose={() => setAiTitlePopoverOpened(false)}
              width={280}
              position='bottom'
              withArrow
              shadow='md'
              zIndex={9999}>
              <Popover.Target>
                <Center>
                  <ActionIcon
                    variant='light'
                    color='red'
                    size='md'
                    onClick={() => setAiTitlePopoverOpened(true)}
                    aria-label='AI-hjälp för titel'
                    title='Låt AI skapa en titel baserad på din beskrivning'
                    mr='xs'>
                    <Sparkles size={18} />
                  </ActionIcon>
                </Center>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack gap='sm'>
                  <Stack gap='xs'>
                    <Text size='sm' fw={500} mb={8}>
                      AI-genererad titel
                    </Text>
                    <Text size='sm' c='dimmed'>
                      Är du säker på att du vill låta AI generera en ny titel?
                      Din nuvarande titel kommer att ersättas.
                    </Text>
                  </Stack>
                  {aiTitleError && (
                    <Alert
                      color='red'
                      icon={<AlertCircle size={16} />}
                      title='Fel'
                      mt={8}>
                      {aiTitleError}
                    </Alert>
                  )}
                  <Group gap='xs'>
                    <Button
                      size='xs'
                      onClick={handleAITitle}
                      loading={aiTitleLoading}
                      fullWidth>
                      {aiTitleError ? 'Försök igen' : 'OK'}
                    </Button>
                    <Button
                      variant='default'
                      size='xs'
                      onClick={() => setAiTitlePopoverOpened(false)}
                      disabled={aiTitleLoading}
                      fullWidth>
                      Avbryt
                    </Button>
                  </Group>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          ) : null
        }
        styles={{
          input: {
            resize: 'none',
          },
        }}
      />

      <Select
        label='Kategori'
        placeholder='Välj en passande kategori'
        data={categoryOptions}
        value={eventDetails.category}
        onChange={(value) =>
          setEventDetails({ ...eventDetails, category: value })
        }
        required
        searchable
        clearable
        nothingFoundMessage='Ingen kategori hittades'
        styles={{ dropdown: { zIndex: 9999 } }}
      />

      <Textarea
        label='Beskrivning'
        placeholder='Beskriv ditt event...'
        value={eventDetails.description}
        onChange={(e) =>
          setEventDetails({
            ...eventDetails,
            description: e.currentTarget.value,
          })
        }
        rows={4}
        required
        rightSection={
          aiDescriptionEnabled ? (
            <Popover
              opened={aiDescPopoverOpened}
              onClose={() => setAiDescPopoverOpened(false)}
              width={280}
              position='bottom'
              withArrow
              shadow='md'
              zIndex={10000}>
              <Popover.Target>
                <Center>
                  <ActionIcon
                    variant='light'
                    color='red'
                    size='md'
                    onClick={() => setAiDescPopoverOpened(true)}
                    aria-label='AI-hjälp för beskrivning'
                    title='Låt AI förfina din beskrivning'>
                    <Sparkles size={18} />
                  </ActionIcon>
                </Center>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack gap='sm'>
                  <Stack gap='xs'>
                    <Text size='sm' fw={500} mb={8}>
                      AI-förfining
                    </Text>
                    <Text size='sm' c='dimmed'>
                      Är du säker på att du vill låta AI förfina din
                      beskrivning? Din nuvarande text kommer att ersättas.
                    </Text>
                  </Stack>
                  {aiDescError && (
                    <Alert
                      color='red'
                      icon={<AlertCircle size={16} />}
                      title='Fel'
                      mt={8}>
                      {aiDescError}
                    </Alert>
                  )}
                  <Group gap='xs'>
                    <Button
                      size='xs'
                      onClick={handleAIDescription}
                      loading={aiDescLoading}
                      fullWidth>
                      {aiDescError ? 'Försök igen' : 'OK'}
                    </Button>
                    <Button
                      variant='default'
                      size='xs'
                      onClick={() => setAiDescPopoverOpened(false)}
                      disabled={aiDescLoading}
                      fullWidth>
                      Avbryt
                    </Button>
                  </Group>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          ) : null
        }
      />

      <MultiSelect
        label='Taggar (valfritt)'
        placeholder='Sök och välj passande taggar'
        data={tagOptions}
        value={eventDetails.tags}
        onChange={(values) =>
          setEventDetails({ ...eventDetails, tags: values })
        }
        searchable
        clearable
      />
    </Stack>
  );
}
