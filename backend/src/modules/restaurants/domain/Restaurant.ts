export interface Restaurant {
  id: number;
  name: string;
  city: string;
  address_string?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}