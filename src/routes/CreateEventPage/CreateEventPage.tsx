import { useState, useEffect } from 'react';
import { Container, TextInput, Textarea, MultiSelect, Select, Button, Text, Box, Group, FileInput } from '@mantine/core';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../api/categories';
import { fetchTags } from '../../api/tags';

interface Option {
  value: string;
  label: string;
}

export default function SkapaEventSida() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [categories, setCategories] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const [categoriesData, tagsData] = await Promise.all([
        fetchCategories(),
        fetchTags(),
      ]);

      const mappedCategories = categoriesData.map(cat => ({
        value: cat.id.toString(),
        label: cat.name,
      }));
      setCategories(mappedCategories);

      const mappedTags = tagsData.map(tag => ({
        value: tag.id.toString(),
        label: tag.name,
      }));
      setTags(mappedTags);
    }

    loadData();
  }, []);

  const handleSubmit = () => {
    navigate('/valj-restaurang');
  };

  return (
    <Container size="sm" py={40} style={{ minHeight: '100vh' }}>
      <Box maw={600} m={0}>
        <BaseButton variantType="ghost" onClick={() => window.history.back()}>
          <ArrowLeft size={16} style={{ marginRight: 6 }} />Tillbaka
        </BaseButton>
        <Text size="xl" fw={500} mb="md">
          Skapa nytt event
        </Text>

        <TextInput
          label="Titel"
          placeholder="Eventets titel"
          required
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          mb="md"
        />

        <Select
          label="Kategori"
          placeholder="Välj kategori"
          data={categories}
          value={category}
          onChange={setCategory}
          searchable
          clearable
          mb="md"
          required
        />

        <Textarea
          label="Beskrivning"
          placeholder="Beskriv eventet"
          minRows={4}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          mb="md"
        />

        <MultiSelect
          label="Taggar / ämnen"
          placeholder="Välj taggar"
          data={tags}
          searchable
          value={selectedTags}
          onChange={setSelectedTags}
          mb="md"
        />

        <FileInput
          label="Lägg till bilder"
          placeholder="Välj bilder"
          accept="image/*"
          multiple
          value={images}
          onChange={(files) => setImages(files || [])}
          mb="xl"
        />

        <Group>
          <Button variant="default" disabled>
            Avbryt
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !category}>
            Nästa
          </Button>
        </Group>
      </Box>
    </Container>
  );
}