import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { extractIdFromSlug, slugify } from '../../utils/slugify';
import './Breadcrumb.scss';
import { fetchEventById } from '../../api/events';
import { fetchRestaurantById } from '../../api/restaurants';
import { fetchCategories } from '../../api/categories';
import { fetchTags } from '../../api/tags';
import { staticRouteLabels } from '../../data/StaticRouteLabels';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [eventName, setEventName] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [tagName, setTagName] = useState<string | null>(null);
  const [tagCategoryName, setTagCategoryName] = useState<string | null>(null);

  // Fetch event/restaurant/category/tag data if needed
  useEffect(() => {
    const eventIndex = pathnames.indexOf('event');
    const restaurantIndex = pathnames.indexOf('restaurang');
    const categoryIndex = pathnames.indexOf('kategori');
    const tagIndex = pathnames.indexOf('tagg');

    if (eventIndex !== -1 && pathnames[eventIndex + 1]) {
      const eventSlug = pathnames[eventIndex + 1];
      const eventId = extractIdFromSlug(eventSlug);
      if (eventId) {
        fetchEventById(eventId)
          .then((data) => {
            setEventName(data?.title || `Event ${eventId}`);
          })
          .catch(() => setEventName(`Event ${eventId}`));
      } else {
        // If no id, try to match event by slugified title
        import('../../api/events').then(({ fetchEvents }) => {
          fetchEvents().then((events) => {
            const match = events.find((e) => slugify(e.title) === eventSlug);
            setEventName(match ? match.title : eventSlug);
          });
        });
      }
    }

    if (restaurantIndex !== -1 && pathnames[restaurantIndex + 1]) {
      const restaurantSlug = pathnames[restaurantIndex + 1];
      const restaurantId = extractIdFromSlug(restaurantSlug);
      if (restaurantId) {
        fetchRestaurantById(restaurantId)
          .then((data) => {
            setRestaurantName(data?.name || `Restaurang ${restaurantId}`);
          })
          .catch(() => setRestaurantName(`Restaurang ${restaurantId}`));
      } else {
        // If no id, try to match restaurant by slugified name
        import('../../api/restaurants').then(({ fetchRestaurants }) => {
          fetchRestaurants().then((restaurants) => {
            const match = restaurants.find(
              (r) => slugify(r.name) === restaurantSlug,
            );
            setRestaurantName(match ? match.name : restaurantSlug);
          });
        });
      }
    }

    if (categoryIndex !== -1 && pathnames[categoryIndex + 1]) {
      const categorySlug = pathnames[categoryIndex + 1];
      fetchCategories()
        .then((categories) => {
          const category = categories.find(
            (c) =>
              c.name.toLowerCase().replace(/\s+/g, '-') === categorySlug ||
              c.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/å/g, 'a')
                .replace(/ä/g, 'a')
                .replace(/ö/g, 'o')
                .replace(/\s+/g, '-') === categorySlug,
          );
          if (category) {
            setCategoryName(category.name);
          }
        })
        .catch(() => setCategoryName(null));
    }

    if (tagIndex !== -1 && pathnames[tagIndex + 1]) {
      const tagSlug = pathnames[tagIndex + 1];
      Promise.all([fetchTags(), fetchCategories()])
        .then(([tags, categories]) => {
          const tag = tags.find(
            (t) =>
              t.name.toLowerCase().replace(/\s+/g, '-') === tagSlug ||
              t.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/å/g, 'a')
                .replace(/ä/g, 'a')
                .replace(/ö/g, 'o')
                .replace(/\s+/g, '-') === tagSlug,
          );
          if (tag) {
            setTagName(tag.name);
            // Find the category for this tag
            if (tag.category_id) {
              const category = categories.find((c) => c.id === tag.category_id);
              if (category) {
                setTagCategoryName(category.name);
              }
            }
          }
        })
        .catch(() => {
          setTagName(null);
          setTagCategoryName(null);
        });
    }
  }, [pathnames]);

  // Hide breadcrumb on profile pages
  if (pathnames[0] === 'profil') {
    return null;
  }

  const items = pathnames
    .map((value, index) => {
      // Check if this is an event ID (show name, not clickable)
      if (pathnames[index - 1] === 'event' && eventName) {
        return (
          <Text key={`event-${index}`} size='sm'>
            {eventName}
          </Text>
        );
      }

      // Check if this is a restaurant ID (show name, not clickable)
      if (pathnames[index - 1] === 'restaurang' && restaurantName) {
        return (
          <Text key={`restaurant-${index}`} size='sm'>
            {restaurantName}
          </Text>
        );
      }

      // Check if this is a category slug (show name, not clickable)
      if (pathnames[index - 1] === 'kategori' && categoryName) {
        return (
          <Text key={`category-${index}`} size='sm'>
            {categoryName}
          </Text>
        );
      }

      // Check if this is a tag slug (show category and tag name, not clickable)
      if (pathnames[index - 1] === 'tagg' && tagName) {
        const elements = [];
        if (tagCategoryName) {
          const categorySlug = slugify(tagCategoryName);
          elements.push(
            <Anchor
              key={`tag-category-${index}`}
              component={Link}
              to={`/kategori/${categorySlug}`}
              size='sm'>
              {tagCategoryName}
            </Anchor>,
          );
        }
        elements.push(
          <Text key={`tag-${index}`} size='sm'>
            {tagName}
          </Text>,
        );
        return elements;
      }

      // Skip "event", "restaurang", "kategori", "tagg" labels
      if (
        value === 'event' ||
        value === 'restaurang' ||
        value === 'kategori' ||
        value === 'tagg'
      ) {
        return null;
      }

      // For other paths, show them as text (not clickable)
      const decodedValue = decodeURIComponent(value);
      const label =
        staticRouteLabels[decodedValue] || decodedValue.replace(/-/g, ' ');
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

      return (
        <Text key={`text-${index}`} size='sm'>
          {capitalizedLabel}
        </Text>
      );
    })
    .flat()
    .filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs mt='md' ml='md' className='breadcrumb'>
      <Anchor component={Link} to='/' size='sm'>
        Startsida
      </Anchor>
      {items}
    </Breadcrumbs>
  );
}
