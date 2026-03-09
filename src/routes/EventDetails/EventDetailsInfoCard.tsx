import { Text, Stack, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

type EventDetailsInfoCardProps = {
  title: string;
  content: string;
};

export default function EventDetailsInfoCard({
  title,
  content,
}: EventDetailsInfoCardProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box
      p='md'
      bdrs='md'
      // bd='1px solid rgba(206, 212, 218, 1)'
      bg='rgba(255, 204, 199, 1)'>
      <Stack align='center' gap={4}>
        <Text size={isMobile ? 'xs' : 'sm'}>{title}</Text>
        <Text size={isMobile ? 'xs' : 'sm'} fw={600} ta='center'>
          {content}
        </Text>
      </Stack>
    </Box>
  );
}
