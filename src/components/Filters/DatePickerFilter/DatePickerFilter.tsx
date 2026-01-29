import { useState } from 'react';
import { Menu, Button, Group, SegmentedControl, Box } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { ChevronDown } from 'lucide-react';

type DateMode = 'single' | 'multiple' | 'range';

export default function DateFilterDropdown() {
  const [opened, setOpened] = useState(false);
  const [mode, setMode] = useState<DateMode>('single');

  const [draftSingle, setDraftSingle] = useState<Date | null>(null);
  const [draftMultiple, setDraftMultiple] = useState<Date[]>([]);
  const [draftRange, setDraftRange] = useState<[Date | null, Date | null]>([ null, null, ]);

  const [appliedSingle, setAppliedSingle] = useState<Date | null>(null);
  const [appliedMultiple, setAppliedMultiple] = useState<Date[]>([]);
  const [appliedRange, setAppliedRange] = useState<[Date | null, Date | null]>([ null, null, ]);

  const appliedCount =
    mode === 'single'
      ? appliedSingle
        ? 1
        : 0
      : mode === 'multiple'
      ? appliedMultiple.length
      : appliedRange[0] && appliedRange[1]
      ? 1
      : 0;

  const handleModeChange = (value: string) => {
    const newMode = value as DateMode;
    setMode(newMode);

    if (newMode !== 'single') setDraftSingle(null);
    if (newMode !== 'multiple') setDraftMultiple([]);
    if (newMode !== 'range') setDraftRange([null, null]);
  };

  const handleSave = () => {
    if (mode === 'single') setAppliedSingle(draftSingle);
    if (mode === 'multiple') setAppliedMultiple(draftMultiple);
    if (mode === 'range') setAppliedRange(draftRange);
    setOpened(false);
  };

  const clearAll = () => {
    setDraftSingle(null);
    setDraftMultiple([]);
    setDraftRange([null, null]);
    setAppliedSingle(null);
    setAppliedMultiple([]);
    setAppliedRange([null, null]);
  };

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      closeOnItemClick={false}
      shadow="md"
      width={260}
      position="bottom-start"
    >
      <Menu.Target>
        <Button rightSection={<ChevronDown size={16} />}>
          Datum {appliedCount > 0 ? `(${appliedCount})` : ''}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Box>
          <SegmentedControl fullWidth mb="sm" value={mode} onChange={handleModeChange}
            data={[
              { label: 'Datum', value: 'single' },
              { label: 'Flera', value: 'multiple' },
              { label: 'Intervall', value: 'range' },
            ]}
          />

          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            {mode === 'single' && (
              <DatePicker
                value={draftSingle}
                onChange={setDraftSingle}
                locale="sv"
                firstDayOfWeek={1}
                style={{ width: '100%' }}
              />
            )}

            {mode === 'multiple' && (
              <DatePicker
                type="multiple"
                value={draftMultiple}
                onChange={setDraftMultiple}
                locale="sv"
                firstDayOfWeek={1}
                style={{ width: '100%' }}
              />
            )}

            {mode === 'range' && (
              <DatePicker
                type="range"
                value={draftRange}
                onChange={setDraftRange}
                locale="sv"
                firstDayOfWeek={1}
                style={{ width: '100%' }}
              />
            )}
          </Box>

          <Group mt="md" grow preventGrowOverflow={false} wrap="nowrap" gap="4">
            <Button variant="subtle" onClick={clearAll}>Rensa alla</Button>
            <Button onClick={handleSave}>Spara</Button>
          </Group>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
}