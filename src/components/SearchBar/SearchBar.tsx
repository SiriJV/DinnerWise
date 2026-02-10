import { Autocomplete } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import './SearchBar.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';

type Suggestion = {
  value: string;
  label: string;
};

export default function SearchBar() {
  const [value, setValue] = useState('');
  const [data, setData] = useState<Suggestion[]>([]);
  const navigate = useNavigate();
  
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
          `http://localhost:3001/search?q=${encodeURIComponent(
            value
          )}&type=all&limit=5`
        );

        if (!res.ok) throw new Error('Något gick fel');

        const json = await res.json();
        const { events, cities, tags, categories, restaurants } = json.results;

        const suggestions: Suggestion[] = [
          ...events.map((e: any) => ({
            value: `event-${slugify(e.title)}-${e.id}`,
            label: `🌐${e.title} event`,
          })),
          ...cities.map((c: any) => ({
            value: `city-${slugify(c.name)}`,
            label: `📍${c.name} stad`,
          })),
          ...tags.map((t: any) => ({
            value: `tag-${slugify(t.name)}`,
            label: `🏷️${t.name} ämne`,
          })),
          ...categories.map((cat: any) => ({
            value: `category-${slugify(cat.name)}`,
            label: `🔡${cat.name} kategori`,
          })),
          ...restaurants.map((r: any) => ({
            value: `restaurant-${slugify(r.name)}-${r.id}`,
            label: `🍽️${r.name}, ${r.city} restaurang`,
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

  return (
    <Autocomplete
      className="searchBar"
      placeholder="Sök..."
      onOptionSubmit={(val) => {
        handleNavigate(val);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNavigate(value);
        }
      }}
      rightSection={
        <SearchIcon
          size={18}
          className="searchBar-icon"
          onClick={handleClick}
          cursor="pointer"
        />
      }
      data={data}
      value={value}
      onChange={setValue}
      maxDropdownHeight={200}
    />
  );
}