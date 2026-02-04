import { useEffect, useState } from 'react';
import { Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core';
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

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        const url = new URL('http://localhost:3001/events');
        if (sortBy) {
          url.searchParams.append('order', sortBy);
        }

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
  }, [sortBy]);

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
        <Group justify='space-between'>
          <Group>
            <FilterDropdown
              fetchUrl='http://localhost:3001/categories'
              label='Kategori'
              onApply={(selected) => {
                console.log('Kategorifilter:', selected);
              }}
            />
            <SearchableFilterDropdown
              label='Stad'
              fetchUrl='http://localhost:3001/cities'
              onApply={(selected) => {
                console.log('Stadfilter:', selected);
              }}
            />
            <SearchableFilterDropdown
              label='Ämne'
              fetchUrl='http://localhost:3001/tags'
              onApply={(selected) => {
                console.log('Ämnefilter:', selected);
              }}
            />
            <PriceDropdown
              label='Pris'
              onApply={(selected) => {
                console.log('Prisfilter:', selected);
              }}
            />
            {/* <DateFilterDropdown
          label="Datum" onApply={(selected) => {
            console.log('Datumfilter:', selected);
          }}
        /> */}
          </Group>
          <Sort onSortChange={handleSortChange} />
        </Group>

        <Stack mt='xs'>
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
