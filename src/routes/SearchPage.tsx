import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Tabs,
  Loader,
  Box,
  Text,
  Group,
  Card,
  Title,
  SimpleGrid,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { searchApi } from '../api/search';
import type { SearchType } from '../api/search';
import PaginatedEventGrid from '../components/PaginatedEventGrid/PaginatedEventGrid';
import TagPill from '../components/TagPill/TagPill';
import { generateRestaurantSlug, slugify } from '../utils/slugify';

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
      {q && (
        <Title order={2}>
          Resultat för: "<strong>{q}</strong>"
        </Title>
      )}
      <Tabs value={type} onChange={handleTabChange} keepMounted={false}>
        <Tabs.List>
          {SEARCH_TYPES.map((t) => (
            <Tabs.Tab key={t.value} value={t.value}>
              {t.label}{' '}
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
              <PaginatedEventGrid events={results} />
            ) : t.value === 'restaurants' ? (
              <SimpleGrid cols={{ base: 1, sm: 1, md: 3, lg: 5 }} spacing='md'>
                {results.map((r: any) => (
                  <Card
                    key={r.id || r.name}
                    withBorder
                    p='md'
                    component='button'
                    className='hover-style'
                    w='auto'
                    style={{
                      cursor: 'pointer',
                      boxShadow: 'none',
                      textAlign: 'left',
                    }}
                    onClick={() =>
                      navigate(
                        `/restaurang/${generateRestaurantSlug(r.name, r.id)}`,
                      )
                    }
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '';
                    }}>
                    <strong>{r.name}</strong>
                    <div>{r.city}</div>
                  </Card>
                ))}
              </SimpleGrid>
            ) : t.value === 'cities' ? (
              <SimpleGrid cols={{ base: 1, sm: 1, md: 4, lg: 6 }} spacing='md'>
                {results.map((c: any) => (
                  <Card
                    key={c.id || c.name}
                    withBorder
                    p='md'
                    component='button'
                    className='hover-style'
                    style={{
                      cursor: 'pointer',
                      boxShadow: 'none',
                      textAlign: 'left',
                    }}
                    onClick={() => navigate(`/stad/${slugify(c.name)}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '';
                    }}>
                    <strong>{c.name}</strong>
                  </Card>
                ))}
              </SimpleGrid>
            ) : t.value === 'categories' ? (
              <SimpleGrid cols={{ base: 1, sm: 1, md: 3, lg: 5 }} spacing='md'>
                {results.map((cat: any) => (
                  <Card
                    key={cat.id || cat.name}
                    withBorder
                    p='md'
                    component='button'
                    className='hover-style'
                    style={{
                      cursor: 'pointer',
                      boxShadow: 'none',
                      textAlign: 'left',
                    }}
                    onClick={() => navigate(`/kategori/${slugify(cat.name)}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '';
                    }}>
                    <strong>{cat.name}</strong>
                  </Card>
                ))}
              </SimpleGrid>
            ) : t.value === 'tags' ? (
              <Group gap='md'>
                {results
                  .filter((t: any) => t.id)
                  .map((t: any) => (
                    <TagPill key={t.id} title={t.name} size='lg' />
                  ))}
              </Group>
            ) : t.value === 'users' ? (
              <SimpleGrid cols={{ base: 1, sm: 1, md: 4, lg: 6 }} spacing='md'>
                {results.map((u: any) => (
                  <Card
                    key={u.id || u.name}
                    withBorder
                    p='md'
                    component='button'
                    className='hover-style'
                    style={{
                      cursor: 'pointer',
                      boxShadow: 'none',
                      textAlign: 'left',
                    }}
                    onClick={() => navigate(`/profil/${u.alias}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = '';
                    }}>
                    <strong>{u.name}</strong>
                    <div>{u.alias}</div>
                  </Card>
                ))}
              </SimpleGrid>
            ) : null}
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  );
}
