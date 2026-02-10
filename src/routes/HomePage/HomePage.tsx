import { useEffect, useState } from 'react';
import { Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import FilterDropdown from '../../components/Filters/FilterDropdown/FilterDropdown';
import SearchableFilterDropdown from '../../components/Filters/SearchFilterDropdown/SearchFilterDropdown';
// import DateFilterDropdown from '../../components/Filters/DatePickerFilter/DatePickerFilter';
import Sort from '../../components/Sort/Sort';
import type { SortValue } from '../../components/Sort/Sort';
import PriceDropdown from '../../components/Filters/PriceDropdown/PriceDropdown';
import FloatingActionButton from '../../components/FAB/FAB';

import EventCard from '../../components/EventCard/EventCard';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import HeroImage from '../../components/HeroImage/HeroImage';
import type { EventType } from '../../types/EventType';

import './HomePage.scss';

export default function HomePage() {
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

        console.log('Fetching events with URL:', url.toString());

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

  const handleSortChange = (value: SortValue) => {
    setSortBy(value);
  };

  return (
    <>
      <HeroImage src='src/assets/3.jpg' alt='Hero Image' position='center' />
      <FloatingActionButton to='/skapa-event' />
      <Stack p='md'>
        <ImageCarousel />
        <Divider mt='sm' mb='lg' />
        <Stack mt='xs'>
          <Title order={2}>Event</Title>
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

              {/* <DateFilterDropdown
                  label="Datum" onApply={(selected) => {
                    console.log('Datumfilter:', selected);
                  }}
                /> */}
            </Group>
            <Sort onSortChange={handleSortChange} />
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
            <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing='md'>
              {events.map((event) => (
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
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Stack>
    </>
  );
}
