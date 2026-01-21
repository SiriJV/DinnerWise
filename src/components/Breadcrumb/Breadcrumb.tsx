import { Breadcrumbs, Anchor } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
      const eventId = pathnames[eventIndex + 1];
      // TODO: Fetch event data from API
      // fetch(`/api/events/${eventId}`).then(res => res.json()).then(data => setEventName(data.title));
      setEventName(`Event ${eventId}`); // Placeholder
    }

    if (restaurantIndex !== -1 && pathnames[restaurantIndex + 1]) {
      const restaurantId = pathnames[restaurantIndex + 1];
      // TODO: Fetch restaurant data from API
      // fetch(`/api/restaurants/${restaurantId}`).then(res => res.json()).then(data => setRestaurantName(data.name));
      setRestaurantName(`Restaurang ${restaurantId}`); // Placeholder
    }
  }, [pathnames]);

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
        <Anchor component={Link} to={href} key={href}>
          {eventName}
        </Anchor>
      );
    }

    // Check if this is a restaurant ID
    if (pathnames[index - 1] === 'restaurang' && restaurantName) {
      return (
        <Anchor component={Link} to={href} key={href}>
          {restaurantName}
        </Anchor>
      );
    }

    // Default behavior for route labels
    const label =
      breadcrumbMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

    return (
      <Anchor component={Link} to={href} key={href}>
        {label}
      </Anchor>
    );
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs mt='md' ml='md'>
      {items}
    </Breadcrumbs>
  );
}
