import { useState } from 'react';
import { geminiApi } from '../../api/gemini';
import {
  Container,
  Stack,
  Title,
  Select,
  Textarea,
  Button,
  Alert,
  Text,
  Paper,
  CopyButton,
  Group,
  Divider,
  Box,
  SimpleGrid,
} from '@mantine/core';
import { AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

const gradients = [
  'linear-gradient(135deg, var(--mantine-color-cyan-2) 0%, var(--mantine-color-indigo-6) 100%)',
  'linear-gradient(135deg, var(--mantine-color-pink-2) 0%, var(--mantine-color-grape-6) 100%)',
  'linear-gradient(135deg, var(--mantine-color-lime-2) 0%, var(--mantine-color-teal-6) 100%)',
  'linear-gradient(135deg, var(--mantine-color-orange-2) 0%, var(--mantine-color-pink-5) 100%)',
  'linear-gradient(135deg, var(--mantine-color-yellow-2) 0%, var(--mantine-color-orange-5) 100%)',
];

export default function GeminiTestPage() {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<
    'event_description' | 'event_title'
  >('event_description');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Vänligen skriv in en prompt');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await geminiApi.generateEventContent(prompt, contentType);
      if (result.success) {
        setResponse(result.content);
      } else {
        setError(result.error || 'Något gick fel');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container size='sm' py='xl'>
        <Paper p='xl' radius='lg' withBorder>
          <Stack gap='xl'>
            <Group justify='space-between' align='flex-start'>
              <Stack gap='xs' style={{ flex: 1 }}>
                <Group gap='sm'>
                  <Sparkles size={28} />
                  <Title order={2} mb={0}>
                    Gemini test{' '}
                  </Title>
                </Group>
                <Text c='dimmed' size='sm'>
                  Låt Gemini AI skapa en unik och fängslande eventbeskrivning
                  baserat på dina nyckelord
                </Text>
              </Stack>
            </Group>

            <Divider />

            <Select
              label='Vad vill du generera?'
              placeholder='Välj typ'
              value={contentType}
              onChange={(value) => setContentType(value as any)}
              data={[
                { value: 'event_description', label: 'Beskrivning' },
                { value: 'event_title', label: 'Titel' },
              ]}
              size='md'
              searchable
            />

            <Textarea
              label={
                contentType === 'event_description'
                  ? 'Nyckelord eller idé'
                  : contentType === 'event_title'
                    ? 'Event-idé'
                    : 'Din fråga'
              }
              name='prompt'
              autoComplete='off'
              placeholder={
                contentType === 'event_description'
                  ? 'T.ex. yoga, meditation, natur, mindfulness'
                  : contentType === 'event_title'
                    ? 'T.ex. yoga event på restaurang'
                    : 'Skriv din fråga här...'
              }
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
              minRows={4}
              size='md'
            />

            <Button
              onClick={handleGenerate}
              loading={loading}
              fullWidth
              size='lg'>
              {loading ? 'Genererar...' : 'Generera'}
            </Button>

            {error && (
              <Alert
                icon={<AlertCircle size={18} />}
                title='Något gick fel'
                color='red'
                onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {response && (
              <Stack gap='md'>
                <Divider />
                <Stack gap='sm'>
                  <Text fw={700} size='lg' c='dark'>
                    Din genererade text
                  </Text>
                  <Paper
                    p='lg'
                    radius='md'
                    bg='white'
                    withBorder
                    style={{ borderColor: '#667eea30' }}>
                    <Text size='md' lh={1.8}>
                      {response}
                    </Text>
                  </Paper>
                </Stack>
                <CopyButton value={response} timeout={2000}>
                  {({ copied, copy }) => (
                    <Button
                      // color={copied ? 'darkgreen.4' : 'darkgreen.4'}
                      color='darkgreen.4'
                      onClick={copy}
                      // variant={copied ? 'filled' : 'light'}
                      variant='light'
                      fullWidth
                      size='md'
                      leftSection={copied ? <CheckCircle size={18} /> : null}>
                      {copied ? 'Kopierad till urklipp!' : 'Kopiera'}
                    </Button>
                  )}
                </CopyButton>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Container>
      <Paper p='xl' radius='lg' withBorder mt='xl'>
        <Stack gap='md'>
          <Title order={3}>Banner Gradients Test</Title>
          <SimpleGrid cols={{ base: 1 }} spacing='md'>
            {gradients.map((gradient, index) => (
              <Box key={index}>
                <Text size='sm' mb='xs' fw={500}>
                  Index: {index}
                </Text>
                <Box
                  h={100}
                  style={{
                    background: gradient,
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      </Paper>
    </>
  );
}
