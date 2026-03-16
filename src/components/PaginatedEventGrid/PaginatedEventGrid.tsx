import { useEffect, useState, useRef } from 'react';
import { SimpleGrid, Group, Pagination, Text, Stack } from '@mantine/core';
import EventCard from '../EventCard/EventCard';
import type { EventType } from '../../types/EventType';
import type { NavigationType } from 'react-router-dom';

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) return [];
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

type PaginatedEventGridProps = {
  events: EventType[];
  pageSize?: number;
  paginationKey?: string;
  navigationType?: NavigationType;
};

export default function PaginatedEventGrid({
  events,
  pageSize = 12,
  paginationKey,
  navigationType,
}: PaginatedEventGridProps) {
  const getInitialPage = () => {
    if (!paginationKey) return 1;
    const stored = sessionStorage.getItem(paginationKey);
    return stored ? parseInt(stored, 10) || 1 : 1;
  };

  const [activePage, setActivePage] = useState<number>(getInitialPage);

  const gridRef = useRef<HTMLDivElement>(null);

  const eventPages = chunk(events, pageSize);
  const pagedEvents = eventPages[activePage - 1] || [];

  // Spara pagination i sessionStorage
  useEffect(() => {
    if (paginationKey) {
      sessionStorage.setItem(paginationKey, String(activePage));
    }
  }, [activePage, paginationKey]);

  // Reset endast vid PUSH-navigation (t.ex. klick på länk)
  useEffect(() => {
    if (navigationType === 'PUSH') {
      setActivePage(1);
      if (paginationKey) {
        sessionStorage.removeItem(paginationKey);
      }
    }
  }, [navigationType, paginationKey]);

  const handlePageChange = (page: number) => {
    setActivePage(page);

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
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing='lg'>
          {pagedEvents.length === 0 ? (
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
