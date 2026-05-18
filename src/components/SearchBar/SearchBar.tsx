import { Autocomplete } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import './SearchBar.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  generateEventSlug,
  generateRestaurantSlug,
  slugify,
} from '../../utils/slugify';
import { getApiEndpoint } from '../../api/config';

type Suggestion = {
  value: string;
  label: string;
};

interface SearchBarProps {
  variant?: 'static' | 'fullwidth';
  style?: React.CSSProperties;
}

export default function SearchBar({
  variant = 'static',
  style,
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const [data, setData] = useState<Suggestion[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (value.length < 2) {
      setData([]);
      return;
    }

    async function fetchSuggestions() {
      try {
        const query = `?q=${encodeURIComponent(value)}&type=all&limit=5`;
        const res = await fetch(
          getApiEndpoint('/search', query),
        );

        if (!res.ok) throw new Error('Något gick fel');

        const json = await res.json();
        const { events = [], cities = [], tags = [], categories = [], restaurants = [], users = [] } =
          json.results || {};

        // Validate all results are arrays
        const safeEvents = Array.isArray(events) ? events : [];
        const safeCities = Array.isArray(cities) ? cities : [];
        const safeTags = Array.isArray(tags) ? tags : [];
        const safeCategories = Array.isArray(categories) ? categories : [];
        const safeRestaurants = Array.isArray(restaurants) ? restaurants : [];
        const safeUsers = Array.isArray(users) ? users : [];

        const suggestions: Suggestion[] = [
          ...safeEvents.map((e: any) => ({
            value: `event-${generateEventSlug(e.title, e.id)}`,
            label: `🌐${e.title} (event)`,
          })),
          ...safeCities.map((c: any) => ({
            value: `city-${slugify(c.name)}`,
            label: `📍${c.name} (stad)`,
          })),
          ...safeTags.map((t: any) => ({
            value: `tag-${slugify(t.name)}`,
            label: `🏷️${t.name} (tagg)`,
          })),
          ...safeCategories.map((cat: any) => ({
            value: `category-${slugify(cat.name)}`,
            label: `🔡${cat.name} (kategori)`,
          })),
          ...safeRestaurants.map((r: any) => ({
            value: `restaurant-${generateRestaurantSlug(r.name, r.id)}`,
            label: `🍽️${r.name}, ${r.city} (restaurang)`,
          })),
          ...safeUsers.map((u: any) => ({
            value: `user-${slugify(u.alias)}`,
            label: `👤${u.name} (@${u.alias})`,
          })),
        ];

        setData(suggestions);
      } catch (error) {
        console.error(error);
        setData([]);
      }
    }

    fetchSuggestions();
  }, [value]);

  const handleNavigate = (rawValue: string) => {
    const [type, ...rest] = rawValue.split('-');
    const slug = rest.join('-');

    switch (type) {
      case 'category':
        navigate(`/kategori/${slug}`);
        break;

      case 'tag':
        navigate(`/tagg/${slug}`);
        break;

      case 'city': {
        const slug = rest.join('-');
        navigate(`/stad/${slug}`);
        break;
      }

      case 'event': {
        const [_, ...rest] = rawValue.split('-');
        const id = rest.pop();
        const slug = rest.join('-');
        navigate(`/event/${slug}-${id}`, { state: { id } });
        break;
      }

      case 'restaurant': {
        const [_, ...rest] = rawValue.split('-');
        const id = rest.pop();
        const slug = rest.join('-');
        navigate(`/restaurang/${slug}-${id}`, { state: { id } });
        break;
      }

      case 'user': {
        const slug = rest.join('-');
        navigate(`/profil/${slug}`);
        break;
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');

    if (location.pathname === '/search' && q) {
      setValue(q);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname !== '/search') {
      setValue('');
    }
  }, [location.pathname]);

  if (variant === 'static') {
    return (
      <Autocomplete
        className='searchBar'
        placeholder='Sök...'
        name='search'
        autoComplete='off'
        onOptionSubmit={(val) => {
          handleNavigate(val);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const match = data.find((s) => s.value === value);
            if (match) {
              handleNavigate(value);
            } else if (value.trim().length > 0) {
              navigate(
                `/search?q=${encodeURIComponent(value.trim())}&type=events`,
              );
            }
          }
        }}
        rightSection={
          <SearchIcon
            size={18}
            onClick={handleClick}
            cursor='pointer'
            color='var(--mantine-color-darkred-5)'
          />
        }
        data={data}
        value={value}
        onChange={setValue}
        maxDropdownHeight={200}
        styles={{
          input: {
            border: '1px solid var(--mantine-color-gray-5)',
            borderRadius: 'var(--mantine-radius-xl)',
            backgroundColor: 'white',
            height: '40px',
            fontSize: '14px',
            color: 'var(--mantine-color-darkred-5)',
            '&:focus': {
              borderColor: 'var(--mantine-color-darkred-5)',
            },
          },
        }}
      />
    );
  }

  if (variant === 'fullwidth') {
    return (
      <Autocomplete
        className='searchBar'
        style={{ width: '100%', ...style }}
        placeholder='Sök...'
        name='search'
        autoComplete='off'
        onOptionSubmit={(val) => {
          handleNavigate(val);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const match = data.find((s) => s.value === value);
            if (match) {
              handleNavigate(value);
            } else if (value.trim().length > 0) {
              navigate(
                `/search?q=${encodeURIComponent(value.trim())}&type=events`,
              );
            }
          }
        }}
        rightSection={
          <SearchIcon
            size={18}
            onClick={handleClick}
            cursor='pointer'
            color='var(--mantine-color-darkred-5)'
          />
        }
        data={data}
        value={value}
        onChange={setValue}
        maxDropdownHeight={200}
        styles={{
          input: {
            border: '1px solid var(--mantine-color-gray-5)',
            borderRadius: 'var(--mantine-radius-xl)',
            backgroundColor: 'white',
            height: '40px',
            fontSize: '14px',
            color: 'var(--mantine-color-darkred-5)',
            '&:focus': {
              borderColor: 'var(--mantine-color-darkred-5)',
            },
          },
        }}
      />
    );
  }
}
