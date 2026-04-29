import { Stack, Box, Text } from '@mantine/core';
import ParticipantAvatars from '../../components/ParticipantAvatars/ParticipantAvatars';
import EventDetailsHostCard from './EventDetailsHostCard';

type Props = {
  participants: any[];
  host: any;
  currentParticipants: number;
  maxParticipants: number;
};

export default function EventParticipantsAndHost({
  participants,
  host,
  currentParticipants,
  maxParticipants,
}: Props) {
  return (
    <Stack gap='xl'>
      <Box>
        <Text fw={600} mb='sm'>
          Deltagare
        </Text>
        <ParticipantAvatars
          participants={participants}
          maxVisible={8}
          size='responsive'
          currentParticipants={currentParticipants}
          maxParticipants={maxParticipants}
        />
      </Box>

      <Box>
        <Text fw={600} mb='sm'>
          Värden
        </Text>
        <EventDetailsHostCard host={host} />
      </Box>
    </Stack>
  );
}
