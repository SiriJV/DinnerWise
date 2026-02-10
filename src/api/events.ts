export type Event = {
  id: number;
  title: string;
  description: string;
  date: Date;
  start_time: string;
  end_time: string;
  price: number;
  current_participants: number;
  max_participants?: number;
  restaurant_id: number;
  restaurant_name?: string;
  restaurant_address?: string;
  category_id: number;
  category_name?: string;
};

export async function fetchEvents(params?: {
  category_id?: number;
}): Promise<Event[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category_id) {
      queryParams.append('category_id', params.category_id.toString());
    }
    
    const url = `http://localhost:3001/events${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }
    const data: Event[] = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to load events:', err);
    return [];
  }
}

export async function fetchEventById(id: number): Promise<Event | null> {
  try {
    const res = await fetch(`http://localhost:3001/events/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch event');
    }
    const data: Event = await res.json();
    return data;
  } catch (err) {
    console.error(`Failed to load event ${id}:`, err);
    return null;
  }
}
