import { Stack, Text, Alert, Card, Group, Badge } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import type { Restaurant } from '../../../api/restaurants';
import type { Category } from '../../../api/categories';

interface EventDetails {
  title: string;
  category: string | null;
  description: string;
  tags: string[];
}

interface SelectedTime {
  date: string;
  time: string;
}

interface Tag {
  id: number;
  name: string;
}

interface CreateEventStep4Props {
  eventDetails: EventDetails;
  selectedRestaurant: Restaurant | null;
  selectedTime: SelectedTime | null;
  categories: Category[];
  allTags: Tag[];
}

export default function CreateEventStep4({
  eventDetails,
  selectedRestaurant,
  selectedTime,
  categories,
  allTags,
}: CreateEventStep4Props) {
  const categoryName = categories.find(
    (c) => c.id.toString() === eventDetails.category,
  )?.name;
  const selectedTagNames = allTags
    .filter((tag) => eventDetails.tags.includes(tag.id.toString()))
    .map((tag) => tag.name);

  return (
    <Stack gap='md' w='100%'>
      <Alert
        icon={<AlertCircle size={16} />}
        color='red'
        title='Granska ditt event'>
        Vänligen bekräfta alla detaljer innan du skapar ditt event.
      </Alert>

      <Card padding='md' radius='md' withBorder>
        <Text fw={500} mb='md'>
          Eventdetaljer
        </Text>
        <Stack gap='xs' ml='md'>
          <Text size='sm'>
            <strong>Titel:</strong> {eventDetails.title}
          </Text>
          <Text size='sm'>
            <strong>Kategori:</strong> {categoryName}
          </Text>
          <Text size='sm'>
            <strong>Beskrivning:</strong> {eventDetails.description}
          </Text>
          {selectedTagNames.length > 0 && (
            <div>
              <Text size='sm' mb='xs'>
                <strong>Taggar:</strong>
              </Text>
              <Group gap='xs' ml='md'>
                {selectedTagNames.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </Group>
            </div>
          )}
        </Stack>
      </Card>

      <Card padding='md' radius='md' withBorder>
        <Text fw={500} mb='md'>
          Restaurang
        </Text>
        <Stack gap='xs' ml='md'>
          <Text size='sm'>
            <strong>Namn:</strong> {selectedRestaurant?.name}
          </Text>
          <Text size='sm'>
            <strong>Stad:</strong> {selectedRestaurant?.city}
          </Text>
          <Text size='sm'>
            <strong>Adress:</strong> {selectedRestaurant?.address_string}
          </Text>
        </Stack>
      </Card>

      <Card padding='md' radius='md' withBorder>
        <Text fw={500} mb='md'>
          Datum & Tid
        </Text>
        <Stack gap='xs' ml='md'>
          <Text size='sm'>
            <strong>Datum:</strong> {selectedTime?.date}
          </Text>
          <Text size='sm'>
            <strong>Tid:</strong> {selectedTime?.time}
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
