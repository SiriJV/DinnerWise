import { Box, Pill } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';

type TagPillProps = {
  title: string;
  key: number;
};

export default function TagPill({ title, key }: TagPillProps) {
  const navigate = useNavigate();
  return (
    <Box
      key={key}
      onClick={() => navigate(`/tagg/${slugify(title)}`)}
      style={{ cursor: 'pointer' }}>
      <Pill>{title}</Pill>
    </Box>
  );
}
