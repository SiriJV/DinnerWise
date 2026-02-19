
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Loader, Box, Text, Group, Paper, SimpleGrid } from '@mantine/core';
import { searchApi } from '../api/search';
import type { SearchType } from '../api/search';
import EventCard from '../components/EventCard/EventCard';

const SEARCH_TYPES: { value: SearchType; label: string }[] = [
  { value: 'events', label: 'Event' },
  { value: 'restaurants', label: 'Restauranger' },
  { value: 'cities', label: 'Städer' },
  { value: 'categories', label: 'Kategorier' },
  { value: 'tags', label: 'Taggar' },
  { value: 'users', label: 'Användare' },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = (params.get('type') as SearchType) || 'events';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError(null);
    searchApi(q, type, 20)
      .then((res) => {
        setResults(res.results || []);
      })
      .catch(() => {
        setError('Kunde inte hämta sökresultat.');
      })
      .finally(() => setLoading(false));
  }, [q, type]);

  const handleTabChange = (tab: string | null) => {
    if (tab) setParams({ q, type: tab });
  };

  return (
    <Box mt="lg" px="md">
      <Tabs value={type} onChange={handleTabChange} keepMounted={false} align="start">
        <Tabs.List>
          {SEARCH_TYPES.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>{t.label}</Tabs.Tab>
          ))}
        </Tabs.List>
        {SEARCH_TYPES.map((t) => (
          <Tabs.Panel key={t.value} value={t.value} pt="md">
            {loading ? (
              <Group justify="start" mt="xl"><Loader /></Group>
            ) : error ? (
              <Text c="red" style={{ textAlign: 'left' }}>{error}</Text>
            ) : results.length === 0 ? (
              <Text c="dimmed" style={{ textAlign: 'left' }}>Inga resultat.</Text>
            ) : t.value === 'events' ? (
              <Box style={{ textAlign: 'left' }}>
                <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing='md'>
                                {results.map((event: any) => (
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
                                    restaurant_city={event.restaurant_city}
                                  />
                                ))}
                              </SimpleGrid>
              </Box>
            ) : t.value === 'restaurants' ? (
              <Box style={{ textAlign: 'left' }}>
                {results.map((r: any) => (
                  <Paper key={r.id || r.name} withBorder p="md" mb="sm">
                    <strong>{r.name}</strong>
                    <div>{r.city}</div>
                  </Paper>
                ))}
              </Box>
            ) : t.value === 'cities' ? (
              <Box style={{ textAlign: 'left' }}>
                {results.map((c: any) => (
                  <Paper key={c.id || c.name} withBorder p="md" mb="sm">
                    <strong>{c.name}</strong>
                  </Paper>
                ))}
              </Box>
            ) : t.value === 'categories' ? (
              <Box style={{ textAlign: 'left' }}>
                {results.map((cat: any) => (
                  <Paper key={cat.id || cat.name} withBorder p="md" mb="sm">
                    <strong>{cat.name}</strong>
                  </Paper>
                ))}
              </Box>
            ) : t.value === 'tags' ? (
              <Box style={{ textAlign: 'left' }}>
                {results.filter((t: any) => t.id).map((t: any) => (
                  <Paper key={t.id || t.name} withBorder p="md" mb="sm">
                    <strong>{t.name}</strong>
                  </Paper>
                ))}
              </Box>
            ) : t.value === 'users' ? (
              <Box style={{ textAlign: 'left' }}>
                {results.map((u: any) => (
                  <Paper key={u.id || u.name} withBorder p="md" mb="sm">
                    <strong>{u.name}</strong>
                    <div>{u.alias}</div>
                  </Paper>
                ))}
              </Box>
            ) : null}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  );
}