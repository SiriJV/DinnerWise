import type { EventType } from '../types/EventType';

export type Event = EventType;

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
