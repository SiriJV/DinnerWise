import { ActionIcon } from '@mantine/core';
import { BookmarkIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface BookmarkButtonProps {
  eventId: number;
  variant?: 'lg' | 'sm';
}

export default function BookmarkButton({
  eventId,
  variant = 'lg',
}: BookmarkButtonProps) {
  const { bookmarks, removeBookmark, addBookmark } = useAuth();
  const isBookmarked = bookmarks.includes(eventId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBookmarked) removeBookmark(eventId);
    else addBookmark(eventId);
  };

  const isSmall = variant === 'sm';

  return (
    <ActionIcon
      onClick={handleClick}
      radius='xl'
      size={isSmall ? 34 : 44}
      variant='filled'
      color='gray.3'
      style={
        isSmall
          ? {
              position: 'absolute',
              top: 12,
              right: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }
          : undefined
      }>
      <BookmarkIcon
        size={isSmall ? 18 : 22}
        color='black'
        fill={isBookmarked ? 'black' : 'none'}
      />
    </ActionIcon>
  );
}
