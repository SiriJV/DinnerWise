import { Box, Pill } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';

type TagPillProps = {
  tagID: number;
  title: string;
};

export default function TagPill({ tagID, title }: TagPillProps) {
  const navigate = useNavigate();
  return (
    <Box
      key={tagID}
      onClick={() => navigate(`/tagg/${slugify(title)}`)}
      style={{ cursor: 'pointer' }}>
      <Pill>{title}</Pill>
    </Box>
  );
}
