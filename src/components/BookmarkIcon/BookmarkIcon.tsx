import { Box } from '@mantine/core';
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

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBookmarked) removeBookmark(eventId);
    else addBookmark(eventId);
  };

  if (variant === 'sm') {
    return (
      <Box
        onClick={handleBookmarkClick}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          cursor: 'pointer',
          background: 'white',
          borderRadius: '50%',
          width: 34,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
        <BookmarkIcon
          size={18}
          color='black'
          fill={isBookmarked ? 'black' : 'none'}
          style={{ display: 'block' }}
        />
      </Box>
    );
  }

  return (
    <Box
      onClick={handleBookmarkClick}
      bg='gray.3'
      w='44px'
      h='44px'
      style={{
        cursor: 'pointer',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <BookmarkIcon
        size={22}
        color='black'
        fill={isBookmarked ? 'black' : 'none'}
        style={{ display: 'block' }}
      />
    </Box>
  );
}
