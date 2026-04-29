export type EventType = {
  id: number;
  title: string;
  description: string;
  date: string | Date;
  start_time: string;
  end_time: string;
  price: number;
  current_participants: number;
  max_participants: number;
  restaurant_id: number;
  restaurant_name?: string;
  restaurant_address?: string;
  restaurant_city?: string;
  category_id: number;
  category_name?: string;
};
