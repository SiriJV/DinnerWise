import { Box, Flex } from '@mantine/core';
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
          borderRadius: 999,
          padding: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
        <BookmarkIcon
          size={18}
          color='black'
          fill={isBookmarked ? 'black' : 'none'}
        />
      </Box>
    );
  }

  return (
    <Flex
      px='md'
      py='sm'
      bg='rgba(206, 212, 218, 1)'
      bdrs='sm'
      style={{
        cursor: 'pointer',
        width: 'fit-content',
      }}
      onClick={handleBookmarkClick}>
      <BookmarkIcon
        size={22}
        color='black'
        fill={isBookmarked ? 'black' : 'none'}
      />
    </Flex>
  );
}
