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
import { fetchCategories, type Category } from '../../api/categories';
import { fetchTagsByCategory, type Tag } from '../../api/tags';
import { fetchEvents } from '../../api/events';

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
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(data);
      setLoading(false);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (!slug || categories.length === 0) return;

    const found = categories.find((cat) => slugify(cat.name) === slug);
    setCategory(found || null);
  }, [slug, categories]);

  useEffect(() => {
    if (!category) return;

    async function loadTags() {
      setLoadingTags(true);
      const data = await fetchTagsByCategory(category.id);
      setTags(data);
      setLoadingTags(false);
    }
    loadTags();
  }, [category]);

  useEffect(() => {
    if (!category) return;

    async function loadEvents() {
      setLoadingEvents(true);
      const data = await fetchEvents({ category_id: category.id });
      setEvents(data);
      setLoadingEvents(false);
    }
    loadEvents();
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
    <Container size='responsive' p='md'>
      <Stack gap='md'>
        <Title order={2}>{category.name}</Title>
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
