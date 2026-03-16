import { Stack, Text, Group } from '@mantine/core';
import TagPill from '../../components/TagPill/TagPill';

type Props = {
  description: string;
  tags: { id: number; name: string }[];
};

export default function EventDescription({ description, tags }: Props) {
  return (
    <Stack>
      <Text mb='lg' size='md' lh={1.6}>
        {description}
      </Text>

      {tags.length > 0 && (
        <Group gap='sm' wrap='wrap'>
          {tags.map((tag) => (
            <TagPill key={tag.id} title={tag.name} />
          ))}
        </Group>
      )}
    </Stack>
  );
}
