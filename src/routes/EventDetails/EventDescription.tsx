import { Stack, Text, Group } from '@mantine/core';
import PillComponent from '../../components/PillComponent/PillComponent';

type Props = {
  description: string;
  tags: { id: number; name: string }[];
  category: { id: number; name: string } | null;
};

export default function EventDescription({
  description,
  tags,
  category,
}: Props) {
  return (
    <Stack>
      <Text mb='lg' size='md' lh={1.6}>
        {description}
      </Text>

      {(category || tags.length > 0) && (
        <Group gap='sm' wrap='wrap'>
          {category && (
            <PillComponent title={category.name} isCategory={true} />
          )}
          {tags.map((tag, index) => (
            <PillComponent key={index} title={tag.name} isCategory={false} />
          ))}
        </Group>
      )}
    </Stack>
  );
}
