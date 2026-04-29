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

/**
 * Report an event (authentication optional for temporary testing)
 */
export async function reportEvent(
  eventId: number,
  token?: string | null,
  reason?: string
): Promise<{ success: boolean; message: string; isDuplicate?: boolean }> {
  try {
    const url = `http://localhost:3001/events/${eventId}/report`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ reason: reason || null }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Kunde inte rapportera eventet');
    }

    console.log('[api] reportEvent success:', data);
    return data;
  } catch (err: any) {
    console.error('[api] reportEvent error:', err.message);
    throw err;
  }
}