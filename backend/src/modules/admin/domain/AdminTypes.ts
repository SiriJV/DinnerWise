export interface AdminEventListItem {
  id: number;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  current_participants: number;
  max_participants: number;
  restaurant_id: number | null;
  restaurant_name: string | null;
  category_id: number | null;
  category_name: string | null;
}

export interface AdminEventDetail extends AdminEventListItem {
  restaurant_address: string | null;
  restaurant_city: string | null;
}

export interface AdminReportedUser {
  report_id: number;
  reported_account_user_id: number | null;
  reported_by_account_user_id: number | null;
  reason: string | null;
  created_at: string;
  reported_user_email: string | null;
  reported_user_alias: string | null;
  reported_user_first_name: string | null;
  reported_user_last_name: string | null;
  reported_user_role: string | null;
  reported_user_clerk_user_id: string | null;
  reporter_email: string | null;
}

export interface AdminReportedEvent {
  report_id: number;
  event_id: number;
  reported_by_account_user_id: number | null;
  reason: string | null;
  status: string | null;
  created_at: string;
  event_title: string | null;
  event_date: string | null;
  event_start_time: string | null;
  event_end_time: string | null;
  event_description: string | null;
  event_price: number | null;
  event_current_participants: number | null;
  event_max_participants: number | null;
  restaurant_id: number | null;
  restaurant_name: string | null;
  restaurant_address: string | null;
  restaurant_city: string | null;
  category_id: number | null;
  category_name: string | null;
  reporter_email: string | null;
  reporter_first_name: string | null;
  reporter_last_name: string | null;
}