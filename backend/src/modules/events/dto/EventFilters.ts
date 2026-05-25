export interface EventFilters {
  categoryIds: number[];
  restaurantId?: number | null;
  cityIds: number[];
  priceIds: number[];
  date?: string | null;
  order?: string | null;
  tagIds: number[];
}
