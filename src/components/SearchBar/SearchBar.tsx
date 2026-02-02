import { Autocomplete } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import './SearchBar.scss';

export default function SearchBar() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <Autocomplete
      className='searchBar'
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
