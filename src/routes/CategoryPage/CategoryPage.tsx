import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Group,
  SimpleGrid,
  Stack,
  Divider,
  Pill,
} from '@mantine/core';
import EventCard from '../../components/EventCard/EventCard';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Tag {
  id: number;
  name: string;
  category_id: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  category_id: number;
  restaurant_id: number;
  current_participants: number;
  price: number;
  date: string;
  start_time: string;
  end_time: string;
}

const slugify = (text?: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/categories')
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Kunde inte hämta kategorier');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!slug || categories.length === 0) return;

    const found = categories.find((cat) => slugify(cat.name) === slug);
    setCategory(found || null);
  }, [slug, categories]);

  useEffect(() => {
    if (!category) return;

    setLoadingTags(true);
    fetch(`http://localhost:3001/tags/category/${category.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Kunde inte hämta taggar');
        return res.json();
      })
      .then((data: Tag[]) => {
        setTags(data);
        setLoadingTags(false);
      })
      .catch((err) => {
        console.error('Fetch tags error:', err);
        setLoadingTags(false);
      });
  }, [category]);

  useEffect(() => {
    if (!category) return;

    setLoadingEvents(true);
    fetch(`http://localhost:3001/events?category_id=${category.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Kunde inte hämta event');
        return res.json();
      })
      .then((data: Event[]) => {
        setEvents(data);
        setLoadingEvents(false);
      })
      .catch((err) => {
        console.error('Fetch events error:', err);
        setLoadingEvents(false);
      });
  }, [category]);

  if (loading)
    return (
      <Container py='xl' px={5}>
        <Text>Laddar kategorier...</Text>
      </Container>
    );
  if (error)
    return (
      <Container py='xl' px={5}>
        <Text color='red'>{error}</Text>
      </Container>
    );
  if (!category)
    return (
      <Container py='xl' px={5}>
        <Text>Kategori hittades inte</Text>
      </Container>
    );

  return (
    <Container size='responsive'>
      <Stack gap='md'>
        <Title order={1}>{category.name}</Title>
        <Text size='lg' c='dimmed'>
          {category.description}
        </Text>

        <Group gap='xs' mb='md' align='center' wrap='wrap'>
          {loadingTags && <Text>Laddar taggar...</Text>}
          {!loadingTags && tags.length === 0 && (
            <Text>Inga taggar för denna kategori.</Text>
          )}
          {!loadingTags && tags.map((tag) => <Pill>{tag.name}</Pill>)}
        </Group>

        <Divider my='sm' />

        <Title order={3}>Event</Title>
        {loadingEvents && <Text>Laddar event...</Text>}
        {!loadingEvents && events.length === 0 && (
          <Text>Inga event för denna kategori.</Text>
        )}

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
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
