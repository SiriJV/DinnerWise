import { useState, useEffect } from 'react';
import { Menu, Button, Group } from '@mantine/core';
import { Check, ChevronDown } from 'lucide-react';
import DisabledTooltipButton from '../../DisabledTooltipButton/DisabledTooltipButton';

interface FilterItem {
  id: number;
  name: string;
}

interface FilterDropdownProps {
  fetchUrl: string;
  label: string;
  onApply?: (selected: FilterItem[]) => void;
}

export default function FilterDropdown({
  fetchUrl,
  label,
  onApply,
}: FilterDropdownProps) {
  const [opened, setOpened] = useState(false);
  const [options, setOptions] = useState<FilterItem[]>([]);
  const [draft, setDraft] = useState<FilterItem[]>([]);
  const [applied, setApplied] = useState<FilterItem[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch(fetchUrl);
        const data = await res.json();
        setOptions(data);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    }
    fetchOptions();
  }, [fetchUrl]);

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
      width={220}
      position='bottom-start'
      styles={{ dropdown: { zIndex: 10000 } }}>
      <Menu.Target>
        <Button rightSection={<ChevronDown size={20} />}>
          {label} {applied.length > 0 ? `(${applied.length})` : ''}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{label}</Menu.Label>

        {options
          .sort((a, b) => {
            const aSelected = draft.some((i) => i.id === a.id);
            const bSelected = draft.some((i) => i.id === b.id);
            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return 0;
          })
          .map((option) => {
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
          <DisabledTooltipButton
            disabled={draft.length === 0}
            tooltip='Du måste lägga till minst ett val innan du kan rensa'
            onClick={clearDraft}
            variant='subtle'>
            Rensa alla
          </DisabledTooltipButton>

          <Button onClick={handleSave}>Spara</Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
