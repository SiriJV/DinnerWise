export type EventType = {
  id: number;
  title: string;
  description: string;
  category_id: number;
  restaurant_id: number;
  current_participants: number;
  price: number;
  date: string;
  start_time: string;
  end_time: string;
  restaurant_name?: string;
  restaurant_address?: string;
};
