import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { extractIdFromSlug } from '../../utils/slugify';
import './Breadcrumb.scss';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [eventName, setEventName] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  // Fetch event/restaurant data if needed
  useEffect(() => {
    const eventIndex = pathnames.indexOf('event');
    const restaurantIndex = pathnames.indexOf('restaurang');

    if (eventIndex !== -1 && pathnames[eventIndex + 1]) {
      const eventSlug = pathnames[eventIndex + 1];
      const eventId = extractIdFromSlug(eventSlug);
      if (eventId) {
        fetch(`http://localhost:3001/events/${eventId}`)
          .then((res) => res.json())
          .then((data) => setEventName(data.title))
          .catch(() => setEventName(`Event ${eventId}`));
      }
    }

    if (restaurantIndex !== -1 && pathnames[restaurantIndex + 1]) {
      const restaurantSlug = pathnames[restaurantIndex + 1];
      const restaurantId = extractIdFromSlug(restaurantSlug);
      if (restaurantId) {
        fetch(`http://localhost:3001/restaurants/${restaurantId}`)
          .then((res) => res.json())
          .then((data) => setRestaurantName(data.name))
          .catch(() => setRestaurantName(`Restaurang ${restaurantId}`));
      }
    }
  }, [pathnames]);

  // Hide breadcrumb on profile pages
  if (pathnames[0] === 'profil') {
    return null;
  }

  const breadcrumbMap: { [key: string]: string } = {
    event: 'Event',
    restaurang: 'Restaurang',
    kategori: 'Kategori',
    profil: 'Profil',
    search: 'Sök',
  };

  const items = pathnames.map((value, index) => {
    const href = `/${pathnames.slice(0, index + 1).join('/')}`;

    // Check if this is an event ID
    if (pathnames[index - 1] === 'event' && eventName) {
      return (
        <Anchor component={Link} to={href} key={href} size='sm'>
          {eventName}
        </Anchor>
      );
    }

    // Check if this is a restaurant ID
    if (pathnames[index - 1] === 'restaurang' && restaurantName) {
      return (
        <Anchor component={Link} to={href} key={href} size='sm'>
          {restaurantName}
        </Anchor>
      );
    }

    // Don't link "Event" or "Restaurang" labels
    if (value === 'event' || value === 'restaurang') {
      const label = breadcrumbMap[value];
      return (
        <Text key={href} size='sm'>
          {label}
        </Text>
      );
    }

    // Default behavior for route labels
    const decodedValue = decodeURIComponent(value);
    const labelWithDashes = breadcrumbMap[value] || decodedValue;
    const label = labelWithDashes.replace(/-/g, ' ');
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

    return (
      <Anchor component={Link} to={href} key={href} size='sm'>
        {capitalizedLabel}
      </Anchor>
    );
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs mt='md' ml='md' className='breadcrumb'>
      {items}
    </Breadcrumbs>
  );
}
