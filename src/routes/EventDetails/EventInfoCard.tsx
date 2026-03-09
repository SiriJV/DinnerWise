import { Text, Stack, Box, Grid } from '@mantine/core';

type EventInfoCardsProps = {
  eventDate: Date;
  startTime: string;
  endTime: string;
  price: number;
};

function EventDetailsInfoCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <Box p='md' bdrs='md' bg='rgba(255, 204, 199, 1)'>
      <Stack align='center' gap={4}>
        <Text size='sm'>{title}</Text>
        <Text size='sm' fw={600} ta='center'>
          {content}
        </Text>
      </Stack>
    </Box>
  );
}

export default function EventInfoCards({
  eventDate,
  startTime,
  endTime,
  price,
}: EventInfoCardsProps) {
  return (
    <Grid gutter='md'>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <EventDetailsInfoCard
          title='Datum'
          content={eventDate.toLocaleDateString('sv-SE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <EventDetailsInfoCard
          title='Tid'
          content={`${startTime.slice(0, 5)}–${endTime.slice(0, 5)}`}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <EventDetailsInfoCard
          title='Pris'
          content={`${Math.floor(price)} kr`}
        />
      </Grid.Col>
    </Grid>
  );
}
