import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '../../hooks/useResponsive';
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
import { HEADER_CONFIG } from '../../config/headerConfig';

type PaginatedEventGridProps = {
  events: EventType[];
  pageSize?: number;
  loading?: boolean;
};

export default function PaginatedEventGrid({
  events,
  pageSize = 12,
  loading = false,
}: PaginatedEventGridProps) {
  const [params, setParams] = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobileScreen = useIsMobile();
  const headerHeight = isMobileScreen
    ? HEADER_CONFIG.MOBILE
    : HEADER_CONFIG.DESKTOP;

  const pageFromUrl = Number(params.get('page')) || 1;
  const [activePage, setActivePage] = useState(pageFromUrl);

  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));

  // Sync URL → state (utan loopar)
  useEffect(() => {
    if (pageFromUrl !== activePage) {
      setActivePage(pageFromUrl);
    }
  }, [pageFromUrl]);

  // Clamp page om data ändras (t.ex. filter)
  useEffect(() => {
    if (activePage > totalPages) {
      handlePageChange(1);
    }
  }, [events]);

  const start = (activePage - 1) * pageSize;
  const pagedEvents = events.slice(start, start + pageSize);

  const handlePageChange = (page: number) => {
    setActivePage(page);

    const newParams = new URLSearchParams(params);
    newParams.set('page', page.toString());
    setParams(newParams);

    // Smooth scroll with header offset
    if (gridRef.current) {
      const elementPosition =
        gridRef.current.getBoundingClientRect().top + window.pageYOffset;
      const yOffset = -(headerHeight + 20);
      const y = elementPosition + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const showEmpty = !loading && pagedEvents.length === 0;

  return (
    <>
      <Stack ref={gridRef}>
        {showEmpty ? (
          <Text p='xl' ta='center' c='dimmed'>
            Det finns just nu inga event som matchar dina filter.
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='lg'>
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <Skeleton key={i} height={280} radius='md' />
                ))
              : pagedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    {...event}
                    date={new Date(event.date)}
                  />
                ))}
          </SimpleGrid>
        )}
      </Stack>

      {totalPages > 1 && (
        <Group justify='center' mt='md'>
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={handlePageChange}
            size='md'
          />
        </Group>
      )}
    </>
  );
}
