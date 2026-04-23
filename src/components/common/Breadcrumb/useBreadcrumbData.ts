import { useEffect, useState } from 'react';
import { extractIdFromSlug, slugify } from '../../../utils/slugify';
import { fetchEventById } from '../../../api/events';
import { fetchRestaurantById } from '../../../api/restaurants';
import { fetchCategories } from '../../../api/categories';
import { fetchTags } from '../../../api/tags';

export function useBreadcrumbData(pathnames: string[]) {
  const [eventName, setEventName] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [tagName, setTagName] = useState<string | null>(null);
  const [tagCategoryName, setTagCategoryName] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const eventIndex = pathnames.indexOf('event');
      const restaurantIndex = pathnames.indexOf('restaurang');
      const categoryIndex = pathnames.indexOf('kategori');
      const tagIndex = pathnames.indexOf('tagg');

      // Event
      if (eventIndex !== -1 && pathnames[eventIndex + 1]) {
        const slug = pathnames[eventIndex + 1];
        const id = extractIdFromSlug(slug);

        if (id) {
          try {
            const data = await fetchEventById(id);
            setEventName(data?.title || `Event ${id}`);
          } catch {
            setEventName(`Event ${id}`);
          }
        }
      }

      // Restaurant
      if (restaurantIndex !== -1 && pathnames[restaurantIndex + 1]) {
        const slug = pathnames[restaurantIndex + 1];
        const id = extractIdFromSlug(slug);

        if (id) {
          try {
            const data = await fetchRestaurantById(id);
            setRestaurantName(data?.name || `Restaurang ${id}`);
          } catch {
            setRestaurantName(`Restaurang ${id}`);
          }
        }
      }

      // Category
      if (categoryIndex !== -1 && pathnames[categoryIndex + 1]) {
        const slug = pathnames[categoryIndex + 1];
        const categories = await fetchCategories();
        const match = categories.find((c) => slugify(c.name) === slug);
        setCategoryName(match?.name || null);
      }

      // Tag
      if (tagIndex !== -1 && pathnames[tagIndex + 1]) {
        const slug = pathnames[tagIndex + 1];
        const [tags, categories] = await Promise.all([
          fetchTags(),
          fetchCategories(),
        ]);

        const tag = tags.find((t) => slugify(t.name) === slug);

        if (tag) {
          setTagName(tag.name);
          const category = categories.find((c) => c.id === tag.category_id);
          setTagCategoryName(category?.name || null);
        }
      }
    };

    load();
  }, [pathnames]);

  return {
    eventName,
    restaurantName,
    categoryName,
    tagName,
    tagCategoryName,
  };
}
