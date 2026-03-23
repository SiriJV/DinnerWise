import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Divider,
  Button,
} from '@mantine/core';
import { newsLetters } from '../../data/newsletters';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { slugify } from '../../utils/slugify';

export default function NewsletterPage(): React.ReactNode {
  const [params, setParams] = useSearchParams();
  const selectedParam = params.get('newsletter');

  const reversedNews = [...newsLetters].reverse(); // konsekvent

  // Hitta index i reversedNews baserat på URL-param
  let selectedIdx: number | null = null;
  if (selectedParam) {
    selectedIdx = reversedNews.findIndex((n, i) => {
      const baseSlug = slugify(n.title);
      // Hantera duplicerade titlar
      if (selectedParam === baseSlug) return true;
      if (selectedParam === `${baseSlug}-${newsLetters.length - 1 - i}`)
        return true;
      return false;
    });
  }

  const [selected, setSelected] = useState<number | null>(selectedIdx);

  // Sync state med URL-param
  useEffect(() => {
    setSelected(selectedIdx);
  }, [selectedIdx]);

  // Hjälpfunktion för dagar sedan
  function daysAgo(dateStr: string) {
    const now = dayjs();
    const date = dayjs(dateStr);
    const diff = now.diff(date, 'day');
    if (diff === 0) return '(idag)';
    if (diff === 1) return '(1 dag sedan)';
    return `(${diff} dagar sedan)`;
  }

  function handleSelect(idx: number) {
    const nl = reversedNews[idx];
    const originalIdx = newsLetters.findIndex((n) => n === nl);
    const baseSlug = slugify(nl.title);
    const sameTitleCount = newsLetters.filter(
      (n) => n.title === nl.title,
    ).length;
    const param = sameTitleCount > 1 ? `${baseSlug}-${originalIdx}` : baseSlug;
    setParams({ newsletter: param });
  }

  function handleBack() {
    setParams({});
  }

  return (
    <Container size='lg' pt='md'>
      {selected === null ? (
        <Title order={2} mb='md'>
          Nyhetsbrev
        </Title>
      ) : (
        <Title order={2} mb='md'>
          Nyhetsbrev - {reversedNews[selected].title}
        </Title>
      )}

      <Stack>
        {selected === null ? (
          reversedNews.map((nl, i) => (
            <Card
              withBorder
              shadow='sm'
              radius='md'
              className='hover-style'
              key={nl.title + i}
              onClick={() => handleSelect(i)}
              style={{ cursor: 'pointer' }}>
              <Card.Section withBorder inheritPadding py='xs'>
                <Group>
                  <Text fw={600}>{nl.title}</Text>
                  <Divider orientation='vertical' size='sm' visibleFrom='sm' />
                  <Text size='xs' c='dimmed'>
                    {dayjs(nl.date).format('YYYY-MM-DD')} {daysAgo(nl.date)}
                  </Text>
                </Group>
              </Card.Section>
              <Text mt='sm' c='dimmed' size='sm' lineClamp={3}>
                {nl.content}
              </Text>
            </Card>
          ))
        ) : (
          <>
            <Card withBorder shadow='sm' radius='md' className='hover-style'>
              <Card.Section withBorder inheritPadding py='xs'>
                <Group justify='space-between'>
                  <Text fw={600}>{reversedNews[selected].title}</Text>
                  <Text size='xs' c='dimmed'>
                    {dayjs(reversedNews[selected].date).format('YYYY-MM-DD')}{' '}
                    {daysAgo(reversedNews[selected].date)}
                  </Text>
                </Group>
              </Card.Section>
              <Text
                mt='sm'
                c='dimmed'
                size='sm'
                style={{ whiteSpace: 'pre-line' }}>
                {reversedNews[selected].content}
              </Text>
            </Card>

            <Group mt='md'>
              <Button variant='transparent' c='red' onClick={handleBack}>
                ← Tillbaka till alla nyheter
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Container>
  );
}
