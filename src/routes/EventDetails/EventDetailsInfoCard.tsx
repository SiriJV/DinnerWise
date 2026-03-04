import { Text, Stack, Box } from '@mantine/core';

type EventDetailsInfoCardProps = {
  title: string;
  content: string;
};

export default function EventDetailsInfoCard({
  title,
  content,
}: EventDetailsInfoCardProps) {
  return (
    <Box
      p='md'
      bdrs='md'
      // bd='1px solid rgba(206, 212, 218, 1)'
      bg='rgba(255, 204, 199, 1)'>
      <Stack align='center' gap={4}>
        <Text size='sm'>{title}</Text>
        <Text fw={600}>{content}</Text>
      </Stack>
    </Box>
  );
}
