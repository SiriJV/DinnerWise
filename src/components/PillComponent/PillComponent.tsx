import { Pill, Text } from '@mantine/core';
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

  const handleClick = () => {
    navigate(
      isCategory ? `/kategori/${slugify(title)}` : `/tagg/${slugify(title)}`,
    );
  };

  return (
    <Pill
      size={size ?? 'md'}
      bg={isCategory ? 'dimmed' : undefined}
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        transition: '0.2s ease',
      }}
      className='hover-style'>
      <Text span c={isCategory ? 'white' : 'black'}>
        {title}
      </Text>
    </Pill>
  );
}
