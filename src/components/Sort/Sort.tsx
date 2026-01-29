import { useState } from 'react';
import { Menu, Button } from '@mantine/core';
import { ChevronDown } from 'lucide-react';

export type SortValue = 'pris' | 'narmast_i_tid' | 'platser_kvar';

interface SortProps {
  onSortChange?: (value: SortValue) => void;
}

const Sort = ({ onSortChange }: SortProps) => {
  const [selected, setSelected] = useState<SortValue | null>(null);

  const sortOptions: { value: SortValue; label: string }[] = [
    { value: 'pris', label: 'Pris' },
    { value: 'narmast_i_tid', label: 'Närmast i tid' },
    { value: 'platser_kvar', label: 'Platser kvar' },
  ];

  const handleSelect = (value: SortValue) => {
    setSelected(value);
    if (onSortChange) onSortChange(value);
  };

  const selectedLabel =
    sortOptions.find((opt) => opt.value === selected)?.label || 'A-Ö';

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="subtle" rightSection={<ChevronDown size={16} />}>
          Sorterar på: {selectedLabel}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {sortOptions.map((option) => (
          <Menu.Item key={option.value} onClick={() => handleSelect(option.value)}>
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default Sort;