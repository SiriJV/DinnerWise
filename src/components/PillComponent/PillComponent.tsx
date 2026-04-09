import { Box, Pill, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';

type PillComponentProps = {
  title: string;
  size?: 'md' | 'lg';
  isCategory?: boolean;
};

export default function PillComponent({
  title,
  size,
  isCategory = false,
}: PillComponentProps) {
  const navigate = useNavigate();
  return (
    <Box
      className='hover-style'
      onClick={() =>
        navigate(
          isCategory
            ? `/kategori/${slugify(title)}`
            : `/tagg/${slugify(title)}`,
        )
      }
      style={{ cursor: 'pointer', transition: '0.2s ease' }}>
      <Pill size={size ?? 'md'} bg={isCategory ? 'dimmed' : ''}>
        <Text span c={isCategory ? 'white' : 'black'}>
          {title}
        </Text>
      </Pill>
    </Box>
  );
}
