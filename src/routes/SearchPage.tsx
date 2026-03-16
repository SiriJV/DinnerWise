import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Tabs,
  Loader,
  Box,
  Text,
  Group,
  Card,
  SimpleGrid,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    <Box mt='lg' px='md'>
      <Tabs value={type} onChange={handleTabChange} keepMounted={false}>
        <Tabs.List>
          {SEARCH_TYPES.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>
              {t.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {SEARCH_TYPES.map((t) => (
          <Tabs.Panel key={t.value} value={t.value} pt='md'>
            {loading ? (
              <Group justify='start' mt='xl'>
                <Loader />
              </Group>
            ) : error ? (
              <Text c='red' style={{ textAlign: 'left' }}>
                {error}
              </Text>
            ) : results.length === 0 ? (
              <Text c='dimmed' style={{ textAlign: 'left' }}>
                Inga resultat.
              </Text>
            ) : t.value === 'events' ? (
              <Box style={{ textAlign: 'left' }}>
                <SimpleGrid
                  cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
                  spacing='md'>
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
                  <Card
                    key={r.id || r.name}
                    withBorder
                    p='md'
                    component='button'
                    style={{
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, background 0.2s',
                      boxShadow: 'none',
                      marginBottom: 16,
                      textAlign: 'left',
                    }}
                    onClick={() => navigate(`/restaurants/${r.id}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(0,0,0,0.08)';
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '';
                    }}>
                    <strong>{r.name}</strong>
                    <div>{r.city}</div>
                  </Card>
                ))}
              </Box>
            ) : t.value === 'cities' ? (
              <Box style={{ textAlign: 'left' }}>
                {results.map((c: any) => (
                  <Card
                    key={c.id || c.name}
                    withBorder
                    p='md'
                    component='button'
                    style={{
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, background 0.2s',
                      boxShadow: 'none',
                      marginBottom: 16,
                      textAlign: 'left',
                    }}
                    onClick={() => navigate(`/cities/${c.id}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(0,0,0,0.08)';
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '';
                    }}>
                    <strong>{c.name}</strong>
                  </Card>
                ))}
              </Box>
            ) : t.value === 'categories' ? (
              <Box style={{ textAlign: 'left' }}>
                {results.map((cat: any) => (
                  <Card
                    key={cat.id || cat.name}
                    withBorder
                    p='md'
                    component='button'
                    style={{
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, background 0.2s',
                      boxShadow: 'none',
                      marginBottom: 16,
                      textAlign: 'left',
                    }}
                    onClick={() => navigate(`/categories/${cat.id}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(0,0,0,0.08)';
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '';
                    }}>
                    <strong>{cat.name}</strong>
                  </Card>
                ))}
              </Box>
            ) : t.value === 'tags' ? (
              <Box style={{ textAlign: 'left' }}>
                {results
                  .filter((t: any) => t.id)
                  .map((t: any) => (
                    <Card
                      key={t.id || t.name}
                      withBorder
                      p='md'
                      component='button'
                      style={{
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, background 0.2s',
                        boxShadow: 'none',
                        marginBottom: 16,
                        textAlign: 'left',
                      }}
                      onClick={() =>
                        navigate(
                          `/tagg/${t.name
                            .toLowerCase()
                            .replace(/å/g, 'a')
                            .replace(/ä/g, 'a')
                            .replace(/ö/g, 'o')}`,
                        )
                      }
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow =
                          '0 2px 8px rgba(0,0,0,0.08)';
                        e.currentTarget.style.background = '#f8f9fa';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = '';
                      }}>
                      <strong>{t.name}</strong>
                    </Card>
                  ))}
              </Box>
            ) : t.value === 'users' ? (
              <Box style={{ textAlign: 'left' }}>
                {results.map((u: any) => (
                  <Card
                    key={u.id || u.name}
                    withBorder
                    p='md'
                    component='button'
                    style={{
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s, background 0.2s',
                      boxShadow: 'none',
                      marginBottom: 16,
                      textAlign: 'left',
                    }}
                    onClick={() => navigate(`/users/${u.id}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(0,0,0,0.08)';
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '';
                    }}>
                    <strong>{u.name}</strong>
                    <div>{u.alias}</div>
                  </Card>
                ))}
              </Box>
            ) : null}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  );
}
