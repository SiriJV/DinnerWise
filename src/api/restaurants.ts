import { API_URL } from './config';

export async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    const res = await fetch(`${API_URL}/restaurants`);
    if (!res.ok) {
      throw new Error('Failed to fetch restaurants');
    }
    const data: Restaurant[] = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to load restaurants:', err);
    return [];
  }
}
export type Restaurant = {
  id: number;
  name: string;
  address_string: string; // Changed from 'address' to match tripadvisor_restaurants table
  city: string;
  location_id: string; // TripAdvisor location ID
  postalcode?: string; // New from tripadvisor_restaurants
  latitude?: number; // New from tripadvisor_restaurants
  longitude?: number; // New from tripadvisor_restaurants
  phone_number?: string;
  website_url?: string;
  photos?: string; // JSON array stored as text
  description?: string;
  cover_picture_url?: string;
  city_id?: number;
  city_name?: string;
};

export async function fetchRestaurantById(
  id: number,
): Promise<Restaurant | null> {
  try {
    const res = await fetch(`${API_URL}/restaurants/${id}`);
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

export async function fetchRestaurantEvents(
  restaurantId: number,
): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_URL}/restaurants/${restaurantId}/events`,
    );
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
