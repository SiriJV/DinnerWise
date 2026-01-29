import { useEffect, useState } from 'react';
import { Menu, Button, TextInput, Group, ScrollArea,} from '@mantine/core';
import { Check, Search, ChevronDown } from 'lucide-react';

type FilterItem = {
  id: number;
  name: string;
};

type Props = {
  label: string;
  fetchUrl: string;
  onApply: (selected: FilterItem[]) => void;
};

export default function SearchableFilterDropdown({ label, fetchUrl, onApply, }: Props) {
  const [opened, setOpened] = useState(false);
  const [items, setItems] = useState<FilterItem[]>([]);
  const [draft, setDraft] = useState<FilterItem[]>([]);
  const [applied, setApplied] = useState<FilterItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${fetchUrl}?q=${encodeURIComponent(search)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setItems)
      .catch(() => {});

    return () => controller.abort();
  }, [fetchUrl, search]);

  const toggle = (item: FilterItem) => {
    setDraft((current) =>
      current.some((i) => i.id === item.id)
        ? current.filter((i) => i.id !== item.id)
        : [...current, item]
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
      onChange={(o) => { setOpened(o); if (o) setDraft(applied); }}
      closeOnItemClick={false}
      width={260}
      shadow="md"
    >
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
          mb="xs"
        />

        <ScrollArea h={240} type="auto">
          {items.map((item) => {
            const checked = draft.some((i) => i.id === item.id);

            return (
              <Menu.Item key={item.id} onClick={() => toggle(item)} rightSection={checked ? <Check size={18} /> : null}>
                {item.name}
              </Menu.Item>
            );
          })}
        </ScrollArea>

        <Group grow preventGrowOverflow={false} wrap="nowrap" gap="4">
          <Button variant="subtle" disabled={draft.length === 0} onClick={() => setDraft([])}>Rensa alla</Button>
          <Button onClick={handleSave}>Spara</Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}