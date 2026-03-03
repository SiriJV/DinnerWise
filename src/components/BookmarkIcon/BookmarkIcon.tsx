import { Box } from '@mantine/core';
import { BookmarkIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface BookmarkButtonProps {
  eventId: number;
}

export default function BookmarkButton({ eventId }: BookmarkButtonProps) {
  const { bookmarks, removeBookmark, addBookmark } = useAuth();
  const isBookmarked = bookmarks.includes(eventId);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) removeBookmark(eventId);
    else addBookmark(eventId);
  };

  return (
    <Box
      className={`bookmarkButton ${isBookmarked ? 'bookmarked' : ''}`}
      onClick={handleBookmarkClick}>
      <BookmarkIcon
        size={18}
        color='black'
        fill={isBookmarked ? 'black' : 'none'}
      />
    </Box>
  );
}
