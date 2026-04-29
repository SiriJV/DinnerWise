import { useState } from 'react';
import { Menu, Button, Group } from '@mantine/core';
import { Check, ChevronDown } from 'lucide-react';

interface FilterItem {
  id: number;
  name: string;
}

interface FilterDropdownProps {
  label: string;
  onApply?: (selected: FilterItem[]) => void;
}

export default function PriceDropdown({ label, onApply }: FilterDropdownProps) {
  const options: FilterItem[] = [
    { id: 1, name: '<50' },
    { id: 2, name: '50-100' },
    { id: 3, name: '>100' },
  ];

  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState<FilterItem[]>([]);
  const [applied, setApplied] = useState<FilterItem[]>([]);

  const toggleDraft = (item: FilterItem) => {
    setDraft((current) =>
      current.some((i) => i.id === item.id)
        ? current.filter((i) => i.id !== item.id)
        : [...current, item],
    );
  };

  const clearDraft = () => setDraft([]);

  const handleSave = () => {
    setApplied(draft);
    setOpened(false);
    if (onApply) onApply(draft);
  };

  return (
    <Menu
      opened={opened}
      onChange={(o) => {
        setOpened(o);
        if (o) setDraft(applied);
      }}
      closeOnItemClick={false}
      shadow='md'
      width={220}>
      <Menu.Target>
        <Button rightSection={<ChevronDown size={20} />}>
          {label} {applied.length > 0 ? `(${applied.length})` : ''}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{label}</Menu.Label>

        {options.map((option) => {
          const checked = draft.some((i) => i.id === option.id);
          return (
            <Menu.Item
              key={option.id}
              onClick={() => toggleDraft(option)}
              rightSection={checked ? <Check size={20} /> : null}>
              {option.name}
            </Menu.Item>
          );
        })}

        <Menu.Divider />

        <Group grow preventGrowOverflow={false} wrap='nowrap' gap='4'>
          <Button
            variant='subtle'
            disabled={draft.length === 0}
            onClick={clearDraft}>
            Rensa alla
          </Button>
          <Button onClick={handleSave}>Spara</Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
