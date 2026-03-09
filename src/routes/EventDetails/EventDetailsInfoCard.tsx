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
    <Box p='md' bdrs='md' bg='rgba(255, 204, 199, 1)'>
      <Stack align='center' gap={4}>
        <Text size={'sm'}>{title}</Text>
        <Text size={'sm'} fw={600} ta='center'>
          {content}
        </Text>
      </Stack>
    </Box>
  );
}
