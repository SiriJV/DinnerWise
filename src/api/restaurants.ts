export type Restaurant = {
  id: number;
  name: string;
  address: string;
  description?: string;
  cover_picture_url?: string;
  city_id: number;
  city_name?: string;
};

export async function fetchRestaurantById(id: number): Promise<Restaurant | null> {
  try {
    const res = await fetch(`http://localhost:3001/restaurants/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch restaurant');
    }
    const data: Restaurant = await res.json();
    return data;
  } catch (err) {
    console.error(`Failed to load restaurant ${id}:`, err);
    return null;
  }
}

export async function fetchRestaurantEvents(restaurantId: number): Promise<any[]> {
  try {
    const res = await fetch(`http://localhost:3001/restaurants/${restaurantId}/events`);
    if (!res.ok) {
      throw new Error('Failed to fetch restaurant events');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Failed to load events for restaurant ${restaurantId}:`, err);
    return [];
  }
}
