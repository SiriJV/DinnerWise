import { useEffect, useState, useRef } from 'react';
import {
  SimpleGrid,
  Group,
  Pagination,
  Text,
  Stack,
  Skeleton,
} from '@mantine/core';
import EventCard from '../EventCard/EventCard';
import type { EventType } from '../../types/EventType';
import { useSearchParams } from 'react-router-dom';

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return [];
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

type PaginatedEventGridProps = {
  events: EventType[];
  pageSize?: number;
  loading?: Boolean;
};

export default function PaginatedEventGrid({
  events,
  pageSize = 12,
  loading = false,
}: PaginatedEventGridProps) {
  const [params, setParams] = useSearchParams();
  const pageParam = params.get('page');
  const [activePage, setActivePage] = useState<number>(
    pageParam ? parseInt(pageParam, 10) : 1,
  );

  // Sync state with URL param
  useEffect(() => {
    if (pageParam) {
      const newPage = parseInt(pageParam, 10);
      if (activePage !== newPage) {
        setActivePage(newPage);
      }
    } else if (activePage !== 1) {
      // Reset to page 1 when page param is removed
      setActivePage(1);
    }
  }, [pageParam, activePage]);

  const gridRef = useRef<HTMLDivElement>(null);

  const eventPages = chunk(events, pageSize);
  const pagedEvents = eventPages[activePage - 1] || [];

  const handlePageChange = (page: number) => {
    setActivePage(page);
    setParams({
      ...Object.fromEntries(params.entries()),
      page: page.toString(),
    });
    // Scrolla upp till toppen av eventlistan
    if (gridRef.current) {
      const yOffset = -130; // justera om du har sticky header
      const y =
        gridRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Stack ref={gridRef}>
        <SimpleGrid cols={{ base: 1, xs: 1, sm: 2, md: 3 }} spacing='lg'>
          {loading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <Skeleton key={i} height={280} radius='md' />
            ))
          ) : pagedEvents.length === 0 ? (
            <Text p='xl' ta='center' c='dimmed'>
              Det finns just nu inga event som matchar dina filter.
            </Text>
          ) : (
            pagedEvents.map((event) => (
              <EventCard
                key={event.id}
                {...event}
                date={new Date(event.date)}
              />
            ))
          )}
        </SimpleGrid>
      </Stack>

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
  );
}
