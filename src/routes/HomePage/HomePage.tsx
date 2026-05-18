import { useEffect, useState } from 'react';
import { Group, Stack, Text, Title } from '@mantine/core';

import FilterDropdown from '../../components/Filters/FilterDropdown/FilterDropdown';
import SearchableFilterDropdown from '../../components/Filters/SearchFilterDropdown/SearchFilterDropdown';
import Sort from '../../components/Sort/Sort';
import type { SortValue } from '../../components/Sort/Sort';
import PriceDropdown from '../../components/Filters/PriceDropdown/PriceDropdown';

import HeroImage from '../../components/HeroImage/HeroImage';
import type { EventType } from '../../types/EventType';

import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';

import NewsLetterCTA from '../../components/NewsLetterCTA/NewsLetterCTA';
import CategoryImageCarousel from '../../components/CategoryImageCarousel/CategoryImageCarousel';
import { getApiEndpoint } from '../../api/config';

export default function HomePage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<
    { id: number; name: string }[]
  >([]);

  const [sortBy, setSortBy] = useState<SortValue | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<number[]>([]);
  const [cityFilters, setCityFilters] = useState<number[]>([]);
  const [tagFilters, setTagFilters] = useState<number[]>([]);
  const [priceFilters, setPriceFilters] = useState<number[]>([]);

  // Fetch tags based on selected category, or all tags if no category selected
  useEffect(() => {
    async function loadTags() {
      try {
        let url: string;
        if (categoryFilters.length > 0) {
          url = getApiEndpoint(`/tags/category/${categoryFilters[0]}`);
        } else {
          url = getApiEndpoint('/tags');
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch tags');
        const data = await res.json();
        
        // Validate response is an array
        if (!Array.isArray(data)) {
          console.warn('HomePage: tags response is not an array', data);
          setAvailableTags([]);
          return;
        }
        
        setAvailableTags(data);
      } catch (err) {
        console.error('Error loading tags:', err);
        setAvailableTags([]);
      }
    }
    loadTags();
  }, [categoryFilters]);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        const url = new URL(getApiEndpoint('/events'));

        if (sortBy) {
          url.searchParams.append('order', sortBy);
        }

        categoryFilters.forEach((id) =>
          url.searchParams.append('category_ids', id.toString()),
        );
        cityFilters.forEach((id) =>
          url.searchParams.append('city_ids', id.toString()),
        );
        tagFilters.forEach((id) =>
          url.searchParams.append('tag_ids', id.toString()),
        );
        priceFilters.forEach((id) =>
          url.searchParams.append('price_ids', id.toString()),
        );

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Kunde inte hämta events');

        const data: EventType[] = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [categoryFilters, cityFilters, tagFilters, priceFilters, sortBy]);

  return (
    <>
      <HeroImage src='src/assets/3.jpg' alt='Hero Image' position='center' />

      <Stack p='md' mb='lg'>
        <CategoryImageCarousel />
        {/* <Divider mt='sm' mb='lg' /> */}
      </Stack>

      <NewsLetterCTA />

      <Stack mt='lg' p='md'>
        <Title order={2}>{`Event (${events.length})`}</Title>

        <Group justify='space-between'>
          <Group>
            <FilterDropdown
              fetchUrl={getApiEndpoint('/categories')}
              label='Kategori'
              onApply={(selected) =>
                setCategoryFilters(selected.map((item) => item.id))
              }
            />

            <SearchableFilterDropdown
              label='Stad'
              fetchUrl={getApiEndpoint('/cities')}
              onApply={(selected) =>
                setCityFilters(selected.map((item) => item.id))
              }
            />

            <SearchableFilterDropdown
              label='Taggar'
              items={availableTags}
              onApply={(selected) =>
                setTagFilters(selected.map((item) => item.id))
              }
            />

            <PriceDropdown
              label='Pris'
              onApply={(selected) =>
                setPriceFilters(selected.map((item) => item.id))
              }
            />
          </Group>

          <Sort onSortChange={setSortBy} />
        </Group>

        {loading ? (
          <Text p='md' ta='center' c='dimmed'>
            Laddar events…
          </Text>
        ) : error ? (
          <Text p='md' c='red' ta='center'>
            Ett fel uppstod: {error}
          </Text>
        ) : (
          <PaginatedEventGrid events={events} loading={loading} />
        )}
      </Stack>
    </>
  );
}
