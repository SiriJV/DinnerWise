import { useEffect, useState } from 'react';
import { useNavigationType } from 'react-router-dom';
import { Divider, Group, Stack, Text, Title } from '@mantine/core';

import FilterDropdown from '../../components/Filters/FilterDropdown/FilterDropdown';
import SearchableFilterDropdown from '../../components/Filters/SearchFilterDropdown/SearchFilterDropdown';
import Sort from '../../components/Sort/Sort';
import type { SortValue } from '../../components/Sort/Sort';
import PriceDropdown from '../../components/Filters/PriceDropdown/PriceDropdown';
import FloatingActionButton from '../../components/FAB/FAB';

import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import HeroImage from '../../components/HeroImage/HeroImage';
import type { EventType } from '../../types/EventType';

import PaginatedEventGrid from '../../components/PaginatedEventGrid/PaginatedEventGrid';

import './HomePage.scss';

export default function HomePage() {
  const navigationType = useNavigationType();

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortValue | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<number[]>([]);
  const [cityFilters, setCityFilters] = useState<number[]>([]);
  const [tagFilters, setTagFilters] = useState<number[]>([]);
  const [priceFilters, setPriceFilters] = useState<number[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        const url = new URL('http://localhost:3001/events');

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
      <FloatingActionButton />

      <Stack p='md'>
        <ImageCarousel />
        <Divider mt='sm' mb='lg' />

        <Stack mt='xs'>
          <Title order={2}>{`Event (${events.length})`}</Title>

          <Group justify='space-between'>
            <Group>
              <FilterDropdown
                fetchUrl='http://localhost:3001/categories'
                label='Kategori'
                onApply={(selected) =>
                  setCategoryFilters(selected.map((item) => item.id))
                }
              />

              <SearchableFilterDropdown
                label='Stad'
                fetchUrl='http://localhost:3001/cities'
                onApply={(selected) =>
                  setCityFilters(selected.map((item) => item.id))
                }
              />

              <SearchableFilterDropdown
                label='Ämne'
                fetchUrl='http://localhost:3001/tags'
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
            <PaginatedEventGrid
              events={events}
              pageSize={9}
              paginationKey='homepage_activePage'
              navigationType={navigationType}
              showTitle={false}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
}
