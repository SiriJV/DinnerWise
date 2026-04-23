import {
  TextInput,
  Stack,
  Text,
  Alert,
  Card,
  Group,
  Center,
} from '@mantine/core';
import { AlertCircle, Search } from 'lucide-react';
import SearchableFilterDropdown from '../../Filters/SearchFilterDropdown/SearchFilterDropdown';
import type { Restaurant } from '../../../api/restaurants';

interface RestaurantSelectionStepProps {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  restaurants: Restaurant[];
  uniqueCities: Array<{ id: number; name: string }>;
  cityFilters: number[];
  setCityFilters: (filters: number[]) => void;
  restaurantSearch: string;
  setRestaurantSearch: (search: string) => void;
  errors: string[];
}

export default function RestaurantSelectionStep({
  selectedRestaurant,
  setSelectedRestaurant,
  restaurants,
  uniqueCities,
  cityFilters,
  setCityFilters,
  restaurantSearch,
  setRestaurantSearch,
  errors,
}: RestaurantSelectionStepProps) {
  const filteredByCity =
    cityFilters.length > 0
      ? restaurants.filter((r) => {
          const cityIndex = uniqueCities.findIndex((c) => c.name === r.city);
          return cityIndex !== -1 && cityFilters.includes(cityIndex);
        })
      : restaurants;

  const filteredBySearch = filteredByCity.filter((r) =>
    r.name.toLowerCase().includes(restaurantSearch.toLowerCase()),
  );

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
      <TextInput
        w='100%'
        placeholder='Sök restaurang...'
        name='restaurant-search'
        autoComplete='off'
        leftSection={<Search size={16} />}
        value={restaurantSearch}
        onChange={(e) => setRestaurantSearch(e.currentTarget.value)}
      />

      <Stack gap='xs'>
        <SearchableFilterDropdown
          fetchUrl='http://localhost:3001/cities'
          label='Stad'
          onApply={(selected: Array<{ id: number; name: string }>) => {
            const selectedIds = selected.map(
              (city: { id: number; name: string }) => {
                const idx = uniqueCities.findIndex(
                  (c: { id: number; name: string }) => c.name === city.name,
                );
                return idx;
              },
            );
            setCityFilters(selectedIds.filter((id: number) => id !== -1));
          }}
        />
      </Stack>
      <Stack gap='sm'>
        {filteredBySearch.length > 0 ? (
          filteredBySearch.map((restaurant) => (
            <Card
              key={restaurant.id}
              padding='md'
              radius='md'
              withBorder
              style={{
                cursor: 'pointer',
                borderWidth: 2,
                borderColor:
                  selectedRestaurant?.id === restaurant.id
                    ? 'var(--mantine-color-red-6)'
                    : 'var(--mantine-color-gray-3)',
                backgroundColor:
                  selectedRestaurant?.id === restaurant.id
                    ? 'var(--mantine-color-lightred-1)'
                    : 'white',
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                setSelectedRestaurant(restaurant);
              }}>
              <Group justify='space-between' mb='xs'>
                <div>
                  <Text fw={500}>{restaurant.name}</Text>
                  <Text size='sm' c='dimmed'>
                    {restaurant.city}
                  </Text>
                </div>
              </Group>
              <Text size='sm'>{restaurant.address_string}</Text>
            </Card>
          ))
        ) : (
          <Center py='xl'>
            <Text size='sm' c='dimmed'>
              Inga restauranger hittades
            </Text>
          </Center>
        )}
      </Stack>
    </Stack>
  );
}
