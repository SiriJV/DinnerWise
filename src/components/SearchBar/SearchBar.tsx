import { Autocomplete, ActionIcon } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './SearchBar.scss';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';

type Suggestion = {
  value: string;
  label: string;
};

interface SearchBarProps {
  variant?: 'expandable' | 'static' | 'fullwidth';
  style?: React.CSSProperties;
}

export default function SearchBar({
  variant = 'static',
  style,
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const [data, setData] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(true);
  };

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
        const res = await fetch(
          `http://localhost:3001/search?q=${encodeURIComponent(value)}&type=all&limit=5`,
        );

        if (!res.ok) throw new Error('Något gick fel');

        const json = await res.json();
        const { events, cities, tags, categories, restaurants } = json.results;

        const suggestions: Suggestion[] = [
          ...events.map((e: any) => ({
            value: `event-${slugify(e.title)}-${e.id}`,
            label: `🌐${e.title} (event)`,
          })),
          ...cities.map((c: any) => ({
            value: `city-${slugify(c.name)}`,
            label: `📍${c.name} (stad)`,
          })),
          ...tags.map((t: any) => ({
            value: `tag-${slugify(t.name)}`,
            label: `🏷️${t.name} (ämne)`,
          })),
          ...categories.map((cat: any) => ({
            value: `category-${slugify(cat.name)}`,
            label: `🔡${cat.name} (kategori)`,
          })),
          ...restaurants.map((r: any) => ({
            value: `restaurant-${slugify(r.name)}-${r.id}`,
            label: `🍽️${r.name}, ${r.city} (restaurang)`,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && variant === 'expandable') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, variant]);

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
        navigate(`/event/${slug}`, { state: { id } });
        break;
      }

      case 'restaurant': {
        const [_, ...rest] = rawValue.split('-');
        const id = rest.pop();
        const slug = rest.join('-');

        navigate(`/restaurang/${slug}`, { state: { id } });
        break;
      }
    }
  };

  if (variant === 'static') {
    return (
      <Autocomplete
        className='searchBar'
        placeholder='Sök...'
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
            className='searchBar-icon'
            onClick={handleClick}
            cursor='pointer'
          />
        }
        data={data}
        value={value}
        onChange={setValue}
        maxDropdownHeight={200}
      />
    );
  }

  if (variant === 'fullwidth') {
    return (
      <Autocomplete
        className='searchBar'
        style={{ width: '100%', ...style }}
        placeholder='Sök...'
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
            className='searchBar-icon'
            onClick={handleClick}
            cursor='pointer'
          />
        }
        data={data}
        value={value}
        onChange={setValue}
        maxDropdownHeight={200}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`searchBar-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <ActionIcon
          variant='subtle'
          color='white'
          size='md'
          onClick={handleToggle}>
          <SearchIcon size={20} />
        </ActionIcon>
      )}
      {isOpen && (
        <Autocomplete
          className='searchBar'
          placeholder='Sök...'
          autoFocus
          onOptionSubmit={(val) => {
            handleNavigate(val);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              // If value matches a suggestion, navigate to that; otherwise, go to search page with type param
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
              className='searchBar-icon'
              onClick={handleClick}
              cursor='pointer'
            />
          }
          data={data}
          value={value}
          onChange={setValue}
          maxDropdownHeight={200}
        />
      )}
    </div>
  );
}
