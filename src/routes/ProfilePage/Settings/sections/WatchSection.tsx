import { Button, Group, Stack, Text } from '@mantine/core';
import { CheckIcon } from 'lucide-react';
import type { Category } from '../../../../api/categories';
import { useEffect, useRef } from 'react';

interface WatchSectionProps {
  categories: Category[];
  tags: { id: number; name: string; category_id?: number }[];
  selectedCategories: string[];
  toggleCategory: (id: string) => void;
}

export default function WatchSection({
  categories,
  tags,
  selectedCategories,
  toggleCategory,
}: WatchSectionProps) {
  // Förhindra att effekten körs mer än en gång
  const initialized = useRef(false);

  // Välj några random taggar och kategorier vid första rendering
  useEffect(() => {
    if (initialized.current) return;
    if (
      (tags.length > 0 || categories.length > 0) &&
      selectedCategories.length === 0
    ) {
      const randomCategories = categories
        .map((c) => c.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const randomTags = tags
        .map((t) => t.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
      [...randomCategories, ...randomTags].forEach((name) => {
        if (!selectedCategories.includes(name)) {
          toggleCategory(name);
        }
      });
      initialized.current = true;
    }
  }, [tags, categories, selectedCategories, toggleCategory]);

  // Gruppera taggar per kategori
  const tagsByCategory = categories.map((cat) => ({
    category: cat,
    tags: tags.filter((t) => t.category_id === cat.id),
  }));

  return (
    <>
      <Text size='sm' c='dimmed'>
        Innehåll du följer.
      </Text>

      {/* Kategorier */}
      <Stack gap='xs'>
        <Text fw={600}>Kategorier</Text>
        <Group gap='xs'>
          {categories?.map((category) => {
            const active = selectedCategories.includes(category.name);

            return (
              <Button
                key={category.id}
                size='xs'
                variant={active ? 'filled' : 'light'}
                onClick={() => toggleCategory(category.name)}
                rightSection={active && <CheckIcon size={16} />}>
                {category.name}
              </Button>
            );
          })}
        </Group>
      </Stack>

      {/* Taggar organiserade per kategori */}
      <Stack gap='lg' mt='lg'>
        <Text fw={600}>Taggar</Text>
        {tagsByCategory.map((item) =>
          item.tags.length > 0 ? (
            <Stack key={item.category.id} gap='xs' mb='sm'>
              <Text fw={600} size='sm' c='dimmed'>
                {item.category.name}
              </Text>
              <Group gap='xs'>
                {item.tags.map((tag) => {
                  const active = selectedCategories.includes(tag.name);

                  return (
                    <Button
                      key={tag.id}
                      size='xs'
                      variant={active ? 'filled' : 'light'}
                      onClick={() => toggleCategory(tag.name)}
                      rightSection={active && <CheckIcon size={16} />}>
                      {tag.name}
                    </Button>
                  );
                })}
              </Group>
            </Stack>
          ) : null,
        )}
      </Stack>
    </>
  );
}
