import { Box, Pill } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';
import './TagPill.scss';

type TagPillProps = {
  title: string;
  size?: 'md' | 'lg';
};

export default function TagPill({ title, size }: TagPillProps) {
  const navigate = useNavigate();
  return (
    <Box
      className='hover-style'
      onClick={() => navigate(`/tagg/${slugify(title)}`)}
      style={{ cursor: 'pointer', transition: '0.2s ease' }}>
      <Pill size={size ?? 'md'}>{title}</Pill>
    </Box>
  );
}
