import { Button, Stack, Text, Alert, Card, Group, Center } from '@mantine/core';
import {
  AlertCircle,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Restaurant } from '../../../api/restaurants';

interface SelectedTime {
  date: string;
  time: string;
}

interface Availability {
  date: string;
  slots: Array<{
    time: string;
    available: boolean;
  }>;
}

interface CreateEventStep3Props {
  selectedRestaurant: Restaurant | null;
  selectedTime: SelectedTime | null;
  setSelectedTime: (time: SelectedTime) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  mockAvailability: Record<number, Availability[]>;
  errors: string[];
}

export default function CreateEventStep3({
  selectedRestaurant,
  selectedTime,
  setSelectedTime,
  currentWeekOffset,
  setCurrentWeekOffset,
  mockAvailability,
  errors,
}: CreateEventStep3Props) {
  if (!selectedRestaurant) return null;

  const availability =
    mockAvailability[selectedRestaurant.id as keyof typeof mockAvailability] ||
    [];
  const visibleDates = availability.slice(
    currentWeekOffset * 7,
    currentWeekOffset * 7 + 7,
  );
  const canGoPrev = currentWeekOffset > 0;
  const canGoNext = currentWeekOffset < 3;

  return (
    <Stack gap='md' w='100%'>
      {errors.length > 0 && (
        <Alert
          icon={<AlertCircle size={16} />}
          color='red'
          title='Valideringsfel'>
          {errors[0]}
        </Alert>
      )}

      <Group justify='space-between' align='center' gap='md'>
        <Button
          variant='light'
          size='sm'
          onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
          disabled={!canGoPrev}
          leftSection={<ChevronLeft size={16} />}></Button>

        <Text
          fw={500}
          size='sm'
          style={{ minWidth: '120px', textAlign: 'center' }}>
          Vecka {currentWeekOffset + 1} av 4
        </Text>

        <Button
          variant='light'
          size='sm'
          onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
          disabled={!canGoNext}
          rightSection={<ChevronRight size={16} />}></Button>
      </Group>

      <Stack gap='lg' w='100%'>
        {visibleDates.length > 0 ? (
          visibleDates.map((slot, idx) => (
            <Card key={idx} padding='md' radius='md' withBorder>
              <Stack gap='xs'>
                <Text
                  fw={500}
                  size='sm'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                  <Calendar size={16} />
                  {slot.date}
                </Text>
                <Group gap='xs' wrap='wrap'>
                  {slot.slots.map((slotData) => (
                    <Button
                      key={slotData.time}
                      variant={
                        selectedTime?.date === slot.date &&
                        selectedTime?.time === slotData.time
                          ? 'filled'
                          : 'light'
                      }
                      onClick={() => {
                        if (slotData.available) {
                          setSelectedTime({
                            date: slot.date,
                            time: slotData.time,
                          });
                        }
                      }}
                      size='xs'
                      disabled={!slotData.available}
                      leftSection={<Clock size={14} />}
                      style={{
                        opacity: slotData.available ? 1 : 0.5,
                      }}
                      title={!slotData.available ? 'Inte tillgänglig' : ''}>
                      {slotData.time}
                    </Button>
                  ))}
                </Group>
              </Stack>
            </Card>
          ))
        ) : (
          <Center py='xl'>
            <Text size='sm' c='dimmed'>
              Inga tillgängliga datum denna vecka
            </Text>
          </Center>
        )}
      </Stack>
    </Stack>
  );
}
