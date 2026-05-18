import { useEffect, useState } from 'react';
import { Menu, Button, TextInput, Group, ScrollArea } from '@mantine/core';
import { Check, Search, ChevronDown } from 'lucide-react';

type FilterItem = {
  id: number;
  name: string;
};

type Props = {
  label: string;
  fetchUrl?: string;
  items?: FilterItem[];
  onApply: (selected: FilterItem[]) => void;
};

export default function SearchableFilterDropdown({
  label,
  fetchUrl,
  items: externalItems,
  onApply,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [items, setItems] = useState<FilterItem[]>([]);
  const [draft, setDraft] = useState<FilterItem[]>([]);
  const [applied, setApplied] = useState<FilterItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // If items are provided directly, use them
    if (externalItems) {
      // Ensure it's actually an array
      if (Array.isArray(externalItems)) {
        setItems(externalItems);
      } else {
        console.warn('SearchableFilterDropdown: externalItems is not an array', externalItems);
        setItems([]);
      }
      return;
    }

    // Otherwise, fetch from URL
    if (!fetchUrl) return;

    const controller = new AbortController();

    fetch(`${fetchUrl}?q=${encodeURIComponent(search)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Ensure response is an array
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.warn('SearchableFilterDropdown: API response is not an array', data);
          setItems([]);
        }
      })
      .catch((err) => {
        console.error('SearchableFilterDropdown: fetch error', err);
        setItems([]);
      });

    return () => controller.abort();
  }, [fetchUrl, search, externalItems]);

  const toggle = (item: FilterItem) => {
    setDraft((current) =>
      current.some((i) => i.id === item.id)
        ? current.filter((i) => i.id !== item.id)
        : [...current, item],
    );
  };

  const handleSave = () => {
    setApplied(draft);
    setOpened(false);
    onApply?.(draft);
  };

  return (
    <Menu
      opened={opened}
      onChange={(o) => {
        setOpened(o);
        if (o) setDraft(applied);
      }}
      closeOnItemClick={false}
      width={260}
      shadow='md'
      position='bottom-start'
      styles={{ dropdown: { zIndex: 10000 } }}>
      <Menu.Target>
        <Button rightSection={<ChevronDown size={18} />}>
          {label}
          {applied.length > 0 ? ` (${applied.length})` : ''}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder={`Sök ${label.toLowerCase()}`}
          leftSection={<Search size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          mb='xs'
        />

        <ScrollArea h={240} type='auto'>
          {Array.isArray(items) && items
            .sort((a, b) => {
              const aSelected = draft.some((i) => i.id === a.id);
              const bSelected = draft.some((i) => i.id === b.id);
              if (aSelected && !bSelected) return -1;
              if (!aSelected && bSelected) return 1;
              return 0;
            })
            .map((item) => {
              const checked = draft.some((i) => i.id === item.id);

              return (
                <Menu.Item
                  key={item.id}
                  onClick={() => toggle(item)}
                  rightSection={checked ? <Check size={18} /> : null}>
                  {item.name}
                </Menu.Item>
              );
            })}
        </ScrollArea>

        <Group grow preventGrowOverflow={false} wrap='nowrap' gap='4'>
          <Button
            variant='subtle'
            disabled={draft.length === 0}
            onClick={() => setDraft([])}>
            Rensa alla
          </Button>
          <Button onClick={handleSave}>Spara</Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
