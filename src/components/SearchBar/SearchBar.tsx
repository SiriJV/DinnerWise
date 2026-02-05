import { Autocomplete, ActionIcon } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './SearchBar.scss';

interface SearchBarProps {
  variant?: 'expandable' | 'static';
}

export default function SearchBar({ variant = 'static' }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(true);
  };

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

  if (variant === 'static') {
    return (
      <Autocomplete
        className='searchBar'
        placeholder='Sök...'
        rightSection={<SearchIcon size={18} className='searchBar-icon' />}
        data={[]}
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
          rightSection={<SearchIcon size={18} className='searchBar-icon' />}
          data={[]}
          maxDropdownHeight={200}
        />
      )}
    </div>
  );
}
