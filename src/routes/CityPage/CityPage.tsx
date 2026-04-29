import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Group, Stack, Text, Title } from '@mantine/core';
import SearchableFilterDropdown from '../../components/Filters/SearchFilterDropdown/SearchFilterDropdown';
import PriceDropdown from '../../components/Filters/PriceDropdown/PriceDropdown';
import Sort from '../../components/Sort/Sort';
import type { SortValue } from '../../components/Sort/Sort';
import type { EventType } from '../../types/EventType';
import { slugify } from '../../utils/slugify';
import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const [city, setCity] = useState<{ id: number; name: string } | null>(null);

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<
    { id: number; name: string }[]
  >([]);

  const [sortBy, setSortBy] = useState<SortValue | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<number[]>([]);
  const [tagFilters, setTagFilters] = useState<number[]>([]);
  const [priceFilters, setPriceFilters] = useState<number[]>([]);

  useEffect(() => {
    if (!slug) return;

    async function loadCity() {
      try {
        const res = await fetch(`http://localhost:3001/cities`);
        const data: { id: number; name: string }[] = await res.json();
        const found = data.find((c) => slugify(c.name) === slug);
        setCity(found || null);
      } catch (err) {
        console.error(err);
        setError('Kunde inte hämta staden');
      }
    }

    loadCity();
  }, [slug]);

  // Fetch tags based on selected category, or all tags if no category selected
  useEffect(() => {
    async function loadTags() {
      try {
        let url: string;
        if (categoryFilters.length > 0) {
          url = `http://localhost:3001/tags/category/${categoryFilters[0]}`;
        } else {
          url = 'http://localhost:3001/tags';
        }
        const res = await fetch(url);
        const data = await res.json();
        setAvailableTags(data);
      } catch (err) {
        console.error('Error loading tags:', err);
        setAvailableTags([]);
      }
    }
    loadTags();
  }, [categoryFilters]);

  useEffect(() => {
    if (!city) return;

    const currentCity = city;

    async function loadEvents() {
      try {
        setLoading(true);

        const url = new URL('http://localhost:3001/events');

        url.searchParams.append('city_ids', currentCity.id.toString());

        categoryFilters.forEach((id) =>
          url.searchParams.append('category_ids', id.toString()),
        );
        tagFilters.forEach((id) =>
          url.searchParams.append('tag_ids', id.toString()),
        );
        priceFilters.forEach((id) =>
          url.searchParams.append('price_ids', id.toString()),
        );

        if (sortBy) url.searchParams.append('order', sortBy);

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
  }, [city, categoryFilters, tagFilters, priceFilters, sortBy]);

  if (error) return <Text c='red'>{error}</Text>;
  if (!city) return <Text>Stad hittades inte</Text>;

  return (
    <Stack p='md'>
      <Title order={2}>
        {city.name} ({events.length} event)
      </Title>

      <Divider mt='sm' mb='lg' />

      <Group justify='space-between'>
        <Group>
          <SearchableFilterDropdown
            label='Kategori'
            fetchUrl='http://localhost:3001/categories'
            onApply={(selected) =>
              setCategoryFilters(selected.map((s) => s.id))
            }
          />

          <SearchableFilterDropdown
            label='Taggar'
            items={availableTags}
            onApply={(selected) => setTagFilters(selected.map((s) => s.id))}
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
          <Text p='xl' ta='center' c='dimmed'>
            Det finns just nu inga event som matchar dina filter.
          </Text>
        ) : (
          <PaginatedEventGrid events={events} loading={loading} />
        )}
      </Stack>
    </Stack>
  );
}
