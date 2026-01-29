import { useEffect, useState } from 'react';
import { Container, TextInput, Stack, Loader, Text, Box } from '@mantine/core';
import SearchableFilterDropdown from '../../components/Filters/SearchFilterDropdown/SearchFilterDropdown'; // din filter dropdown för stad
import { ArrowLeft } from 'lucide-react';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';

interface Restaurant {
  id: number;
  name: string;
  city: string;
  address?: string;
  image_url?: string;
}

export default function SelectRestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:3001/restaurants';
      const params = new URLSearchParams();

      if (cityFilter) {
        params.append('city', cityFilter);
      }

      if (searchTerm) {
        url = 'http://localhost:3001/restaurants/search';
        params.set('q', searchTerm);
      }

      const res = await fetch(`${url}?${params.toString()}`);
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Kunde inte hämta restauranger', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [cityFilter, searchTerm]);

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">

        <BaseButton variantType="ghost" onClick={() => window.history.back()}>
          <ArrowLeft size={16} style={{ marginRight: 6 }} />Tillbaka
        </BaseButton>
        <Text size="xl" fw={500}>Välj restaurang</Text>

        <TextInput
          placeholder="Sök restaurang"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
        
        <SearchableFilterDropdown
          label="Stad"
          fetchUrl="http://localhost:3001/cities"
          onApply={(selected) => {
            console.log({selected});
          }}
        />

        {loading ? (
          <Loader />
        ) : restaurants.length > 0 ? (
          <Stack>
            {restaurants.map((r) => (
              <Box
                key={r.id}
                onClick={() => alert(`Restaurang ${r.name} vald`)}
              >
                <Text fw={400}>{r.name}</Text>
                <Text size="sm" c="dimmed">{r.city}</Text>
                <Text size="sm" c="dimmed">{r.address}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text c="dimmed">Inga restauranger att visa</Text>
        )}
      </Stack>
    </Container>
  );
}