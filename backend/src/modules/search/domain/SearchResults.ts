export interface SearchEvent {
  id: number;
  title: string;
  description: string;
  category_id: number;
  restaurant_id: number;
  current_participants: number;
  max_participants: number;
  price: number;
  date: string;
  start_time: string;
  end_time: string;
  restaurant_name: string;
  restaurant_address: string | null;
  restaurant_city: string | null;
}

export interface SearchCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface SearchRestaurant {
  id: number;
  name: string;
  city: string;
}

export interface SearchUser {
  id: number;
  name: string;
  alias: string;
}

export interface SearchTag {
  id: number;
  name: string;
}

export interface SearchCategory {
  id: number;
  name: string;
}