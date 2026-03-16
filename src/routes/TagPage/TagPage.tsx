import { useEffect, useState } from 'react';
import { useNavigationType, useParams } from 'react-router-dom';
import { Divider, Group, Stack, Text, Title } from '@mantine/core';
import SearchableFilterDropdown from '../../components/Filters/SearchFilterDropdown/SearchFilterDropdown';
import PriceDropdown from '../../components/Filters/PriceDropdown/PriceDropdown';
import Sort from '../../components/Sort/Sort';
import type { SortValue } from '../../components/Sort/Sort';
import type { EventType } from '../../types/EventType';
import { slugify } from '../../utils/slugify';
import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';

export default function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const [tag, setTag] = useState<{ id: number; name: string } | null>(null);

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortValue | null>(null);
  const [cityFilters, setCityFilters] = useState<number[]>([]);
  const [priceFilters, setPriceFilters] = useState<number[]>([]);
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!slug) return;

    async function loadTag() {
      try {
        const res = await fetch(`http://localhost:3001/tags`);
        const data: { id: number; name: string }[] = await res.json();
        const found = data.find((t) => slugify(t.name) === slug);
        setTag(found || null);
      } catch (err) {
        console.error(err);
        setError('Kunde inte hämta taggen');
      }
    }

    loadTag();
  }, [slug]);

  useEffect(() => {
    if (!tag) return;

    const currentTag = tag;

    async function loadEvents() {
      try {
        setLoading(true);

        const url = new URL('http://localhost:3001/events');

        url.searchParams.append('tag_ids', currentTag.id.toString());

        cityFilters.forEach((id) =>
          url.searchParams.append('city_ids', id.toString()),
        );
        priceFilters.forEach((id) =>
          url.searchParams.append('price_ids', id.toString()),
        );

        if (sortBy) url.searchParams.append('order', sortBy);

        console.log('Fetching events for tag page:', url.toString());

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Kunde inte hämta events');
        const data: EventType[] = await res.json();
        setEvents(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Kunde inte hämta events');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [tag, cityFilters, priceFilters, sortBy]);

  if (error) return <Text c='red'>{error}</Text>;
  if (!tag) return <Text>Tagg hittades inte</Text>;

  return (
    <Stack p='md'>
      <Title order={2}>
        {tag.name} ({events.length} event)
      </Title>

      <Divider mt='sm' mb='lg' />

      <Group justify='space-between'>
        <Group>
          <SearchableFilterDropdown
            label='Stad'
            fetchUrl='http://localhost:3001/cities'
            onApply={(selected) => setCityFilters(selected.map((s) => s.id))}
          />

          <PriceDropdown
            label='Pris'
            onApply={(selected) => setPriceFilters(selected.map((s) => s.id))}
          />
        </Group>

        <Sort onSortChange={(value) => setSortBy(value)} />
      </Group>

      <Stack mt='xs'>
        {loading ? (
          <Text p='md' ta='center' c='dimmed'>
            Laddar events…
          </Text>
        ) : events.length === 0 ? (
          <Text p='md' ta='center'>
            Inga events för denna tagg.
          </Text>
        ) : (
          <PaginatedEventGrid
            events={events}
            paginationKey='tagpage_activePage'
            navigationType={navigationType}
          />
        )}
      </Stack>
    </Stack>
  );
}
