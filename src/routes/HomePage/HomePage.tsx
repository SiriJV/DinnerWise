import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import {
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Pagination,
} from '@mantine/core';
// Utility: chunk array into pages
function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}
import FilterDropdown from '../../components/Filters/FilterDropdown/FilterDropdown';
import SearchableFilterDropdown from '../../components/Filters/SearchFilterDropdown/SearchFilterDropdown';
// import DateFilterDropdown from '../../components/Filters/DatePickerFilter/DatePickerFilter';
import Sort from '../../components/Sort/Sort';
import type { SortValue } from '../../components/Sort/Sort';
import PriceDropdown from '../../components/Filters/PriceDropdown/PriceDropdown';
import FloatingActionButton from '../../components/FAB/FAB';
import CreateEventModal from '../../components/CreateEventModal';

import EventCard from '../../components/EventCard/EventCard';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import HeroImage from '../../components/HeroImage/HeroImage';
import type { EventType } from '../../types/EventType';

import './HomePage.scss';

export default function HomePage() {
  const location = useLocation();
  const navigationType = useNavigationType ? useNavigationType() : 'PUSH';
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortValue | null>(null);

  const [categoryFilters, setCategoryFilters] = useState<number[]>([]);
  const [cityFilters, setCityFilters] = useState<number[]>([]);
  const [tagFilters, setTagFilters] = useState<number[]>([]);
  const [priceFilters, setPriceFilters] = useState<number[]>([]);

  const [modalOpened, setModalOpened] = useState(false);

  // Pagination state with sessionStorage persistence
  const eventTitleRef = useRef<HTMLHeadingElement>(null);
  const pageSize = 9;
  const PAGINATION_KEY = 'homepage_activePage';
  const getInitialPage = () => {
    // Återställ till 1 om navigation är PUSH (t.ex. klick på HomePage-länk)
    if (navigationType === 'PUSH') {
      sessionStorage.removeItem(PAGINATION_KEY);
      return 1;
    }
    const stored = sessionStorage.getItem(PAGINATION_KEY);
    return stored ? parseInt(stored, 10) || 1 : 1;
  };
  const [activePage, setActivePage] = useState<number>(getInitialPage);

  // Chunk events into pages
  const eventPages = chunk(events, pageSize);
  const pagedEvents = eventPages[activePage - 1] || [];

  // Spara pagineringsläge när det ändras
  useEffect(() => {
    sessionStorage.setItem(PAGINATION_KEY, String(activePage));
  }, [activePage]);

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
        setActivePage(getInitialPage()); // Återställ till sparad sida eller 1
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilters, cityFilters, tagFilters, priceFilters, sortBy]);

  const handleSortChange = (value: SortValue) => {
    setSortBy(value);
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
    // Only scroll if navigationType is PUSH (not POP/back)
    if (navigationType === 'PUSH' && eventTitleRef.current) {
      const yOffset = -80; // Justera denna höjd till din header
      const y =
        eventTitleRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <CreateEventModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
      <HeroImage src='src/assets/3.jpg' alt='Hero Image' position='center' />
      <FloatingActionButton onClick={() => setModalOpened(true)} />
      <Stack p='md'>
        <ImageCarousel />
        <Divider mt='sm' mb='lg' />
        <Stack mt='xs'>
          <Title order={2} ref={eventTitleRef}>
            {`Event (${events.length})`}
          </Title>
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
            <>
              <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing='md'>
                {pagedEvents.length === 0 ? (
                  <Text p='xl' ta='center' c='dimmed'>
                    Det finns just nu inga event som matchar dina filter.
                  </Text>
                ) : (
                  pagedEvents.map((event) => (
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
                  ))
                )}
              </SimpleGrid>
              {eventPages.length > 1 && (
                <Group justify='center' mt='md'>
                  <Pagination
                    total={eventPages.length}
                    value={activePage}
                    onChange={handlePageChange}
                    size='md'
                  />
                </Group>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
}
