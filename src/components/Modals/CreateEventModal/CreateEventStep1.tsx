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
  Button,
  CloseButton,
} from '@mantine/core';
import { AlertCircle, Sparkles, Check } from 'lucide-react';
import { geminiApi } from '../../../api/gemini';

interface EventDetails {
  title: string;
  category: string | null;
  description: string;
  tags: string[];
}

type ErrorType =
  | 'timeout'
  | 'quota'
  | 'high_demand'
  | 'server_error'
  | 'network'
  | 'unknown';

interface CreateEventStep1Props {
  eventDetails: EventDetails;
  setEventDetails: (details: EventDetails) => void;
  categoryOptions: Array<{ value: string; label: string }>;
  tagOptions: Array<{ value: string; label: string }>;
  errors: string[];
  isLoading: boolean;
}

const getErrorMessage = (errorType?: ErrorType): string => {
  switch (errorType) {
    case 'quota':
      return 'API-gränsen för idag är nådd. Försök igen imorgon!';
    case 'high_demand':
      return 'AI-tjänsten är överbelastad just nu. Försök igen om några minuter.';
    case 'timeout':
      return 'Genereringen tog för lång tid. Försök igen, eller testa en kortare beskrivning.';
    case 'network':
      return 'Nätverksfel. Kontrollera din internetanslutning och försök igen.';
    case 'server_error':
      return 'Serverfel. Försök igen senare.';
    default:
      return 'Något gick fel med AI-genereringen. Försök igen.';
  }
};

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
      setTimeout(
        () => setError('Vi försöker fortfarande, detta kan ta en stund...'),
        15000,
      ),
    );

    timeoutIds.push(
      setTimeout(() => {
        setError(getErrorMessage('timeout'));
        setLoading(false);
      }, 60000),
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
        setAiTitleError(result.error || getErrorMessage(result.errorType));
      }
    } catch (err) {
      timeoutIds.forEach(clearTimeout);
      setAiTitleError(
        err instanceof Error ? err.message : getErrorMessage('network'),
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
        setAiDescError(result.error || getErrorMessage(result.errorType));
      }
    } catch (err) {
      timeoutIds.forEach(clearTimeout);
      setAiDescError(
        err instanceof Error ? err.message : getErrorMessage('network'),
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
    <Stack gap='md' w='100%'>
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
        w='100%'
        label='Titel'
        placeholder='Ge ditt event en titel'
        name='event-title'
        autoComplete='off'
        value={eventDetails.title}
        onChange={(e) =>
          setEventDetails({ ...eventDetails, title: e.currentTarget.value })
        }
        required
        autosize
        minRows={1}
        maxRows={2}
        rightSectionProps={{
          style: {
            pointerEvents: 'auto',
          },
        }}
        rightSection={
          aiTitleEnabled ? (
            <Popover
              opened={aiTitlePopoverOpened}
              onClose={() => setAiTitlePopoverOpened(false)}
              width={280}
              position='bottom'
              withArrow
              shadow='md'
              zIndex={9999}
              withinPortal={true}
              closeOnClickOutside={true}
              closeOnEscape={true}
              trapFocus={false}>
              <Popover.Target>
                <ActionIcon
                  variant='light'
                  color='red'
                  size='md'
                  onClick={() => {
                    setAiTitlePopoverOpened(!aiTitlePopoverOpened);
                    setAiDescPopoverOpened(false);
                  }}
                  aria-label='AI-hjälp för titel'
                  title='Låt AI skapa en titel baserad på din beskrivning'>
                  <Sparkles size={18} />
                </ActionIcon>
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
        w='100%'
        label='Kategori'
        placeholder='Välj en passande kategori'
        name='event-category'
        autoComplete='off'
        data={categoryOptions}
        value={eventDetails.category}
        onChange={(value) =>
          setEventDetails({ ...eventDetails, category: value })
        }
        required
        searchable
        clearable
        nothingFoundMessage='Ingen kategori hittades'
        maxDropdownHeight={200}
        comboboxProps={{
          zIndex: 1100,
          withinPortal: true,
          position: 'bottom-start',
        }}
      />

      <Textarea
        w='100%'
        label='Beskrivning'
        placeholder='Beskriv ditt event...'
        name='event-description'
        autoComplete='off'
        value={eventDetails.description}
        onChange={(e) =>
          setEventDetails({
            ...eventDetails,
            description: e.currentTarget.value,
          })
        }
        rows={4}
        required
        rightSectionProps={{
          style: {
            pointerEvents: 'auto',
          },
        }}
        rightSection={
          aiDescriptionEnabled ? (
            <Popover
              opened={aiDescPopoverOpened}
              onClose={() => setAiDescPopoverOpened(false)}
              width={280}
              position='bottom'
              withArrow
              shadow='md'
              zIndex={10000}
              withinPortal={true}
              closeOnClickOutside={true}
              closeOnEscape={true}
              trapFocus={false}>
              <Popover.Target>
                <ActionIcon
                  variant='light'
                  color='red'
                  size='md'
                  onClick={() => {
                    setAiDescPopoverOpened(!aiDescPopoverOpened);
                    setAiTitlePopoverOpened(false);
                  }}
                  aria-label='AI-hjälp för beskrivning'
                  title='Låt AI förfina din beskrivning'>
                  <Sparkles size={18} />
                </ActionIcon>
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
        w='100%'
        label='Taggar (valfritt)'
        placeholder={
          eventDetails.category
            ? 'Sök och välj passande taggar'
            : 'Välj kategori först'
        }
        name='event-tags'
        autoComplete='off'
        data={[
          ...tagOptions.filter((opt) => eventDetails.tags.includes(opt.value)),
          ...tagOptions.filter((opt) => !eventDetails.tags.includes(opt.value)),
        ]}
        value={eventDetails.tags}
        onChange={(values) =>
          setEventDetails({ ...eventDetails, tags: values })
        }
        searchable
        disabled={!eventDetails.category}
        maxDropdownHeight={200}
        withCheckIcon={false}
        rightSection={
          eventDetails.tags.length > 0 ? (
            <CloseButton
              size='sm'
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setEventDetails({ ...eventDetails, tags: [] })}
              aria-label='Rensa taggar'
            />
          ) : null
        }
        rightSectionPointerEvents='all'
        renderOption={({ option }) => (
          <Group gap='sm' justify='space-between' w='100%'>
            <Text size='sm'>{option.label}</Text>
            {eventDetails.tags.includes(option.value) && <Check size={16} />}
          </Group>
        )}
        comboboxProps={{
          zIndex: 1100,
          withinPortal: true,
          position: 'bottom-start',
        }}
      />
    </Stack>
  );
}
