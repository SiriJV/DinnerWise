import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SearchableFilterDropdown from '../../components/Filters/SearchFilterDropdown/SearchFilterDropdown';
import PriceDropdown from '../../components/Filters/PriceDropdown/PriceDropdown';
import Sort from '../../components/Sort/Sort';
import type { SortValue } from '../../components/Sort/Sort';
import { Title, Text, Group, Stack, Divider } from '@mantine/core';
import type { EventType } from '../../types/EventType';
import { slugify } from '../../utils/slugify';
import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';
import PillComponent from '../../components/PillComponent/PillComponent';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<{
    id: number;
    name: string;
    description: string;
  } | null>(null);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortValue | null>(null);
  const [cityFilters, setCityFilters] = useState<number[]>([]);
  const [tagFilters, setTagFilters] = useState<number[]>([]);
  const [priceFilters, setPriceFilters] = useState<number[]>([]);

  useEffect(() => {
    if (!slug) return;

    async function loadCategory() {
      try {
        const res = await fetch(`http://localhost:3001/categories`);
        const data: { id: number; name: string; description: string }[] =
          await res.json();
        const found = data.find((c) => slugify(c.name) === slug);
        setCategory(found || null);
      } catch (err) {
        console.error(err);
        setError('Kunde inte hämta kategorin');
      }
    }

    loadCategory();
  }, [slug]);

  useEffect(() => {
    if (!category) return;

    const currentCategory = category;

    async function loadTags() {
      try {
        const res = await fetch(
          `http://localhost:3001/tags/category/${currentCategory.id}`,
        );
        if (!res.ok) throw new Error('Kunde inte hämta taggar');
        const data: { id: number; name: string }[] = await res.json();
        setTags(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadTags();
  }, [category]);

  useEffect(() => {
    if (!category) return;

    const currentCategory = category;

    async function loadEvents() {
      try {
        setLoading(true);

        const url = new URL('http://localhost:3001/events');

        url.searchParams.append('category_ids', currentCategory.id.toString());

        cityFilters.forEach((id) =>
          url.searchParams.append('city_ids', id.toString()),
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
  }, [category, cityFilters, tagFilters, priceFilters, sortBy]);

  if (error) return <Text c='red'>{error}</Text>;
  if (!category) return <Text>Kategori hittades inte</Text>;

  return (
    <>
      <Stack p='md'>
        <Title order={2}>
          {category.name} ({events.length} event)
        </Title>
        {category.description && (
          <Text size='lg' c='dimmed' mb='sm'>
            {category.description}
          </Text>
        )}

        {tags.length > 0 && (
          <Group gap='xs' mb='md' wrap='wrap'>
            {tags.map((tag, index) => (
              <PillComponent key={index} title={tag.name} />
            ))}
          </Group>
        )}

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
            <Text p='xl' ta='center' c='dimmed'>
              Det finns just nu inga event som matchar dina filter.
            </Text>
          ) : (
            <PaginatedEventGrid events={events} loading={loading} />
          )}
        </Stack>
      </Stack>
    </>
  );
}
