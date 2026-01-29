import { Autocomplete } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import './SearchBar.scss';

type SearchBarProps = {
  onHomePage?: boolean;
};

export default function SearchBar({ onHomePage = false }: SearchBarProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <Autocomplete
      className={`searchBar ${onHomePage ? 'searchBar-home-page' : ''}`}
      placeholder='Sök...'
      rightSection={
        <SearchIcon
          size={18}
          className='searchBar-icon'
          onClick={handleClick}
          cursor='pointer'
        />
      }
      data={[]}
      visibleFrom='xs'
      maxDropdownHeight={200}
    />
  );
}
