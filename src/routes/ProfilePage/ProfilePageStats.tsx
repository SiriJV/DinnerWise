import { Text, Stack, Box, Group } from '@mantine/core';
import './ProfilePage.scss';

type ProfilePageStatsProps = {
  followers: number;
  following: number;
  events: number;
};

export default function ProfilePageStats({
  followers,
  following,
  events,
}: ProfilePageStatsProps) {
  return (
    <Group
      gap='xs'
      wrap='nowrap'
      pos='absolute'
      bottom={25}
      right={24}
      bg='white'
      px='xs'
      py='xs'
      className='stats-wrapper'>
      <Box px='xs' py='xs' className='stats'>
        <Stack align='center' gap='xs'>
          <Text fw={700} size='md'>
            {followers}
          </Text>
          <Text c='dimmed' size='xs'>
            Följare
          </Text>
        </Stack>
      </Box>

      <Box px='xs' py='xs' className='stats'>
        <Stack align='center' gap='xs'>
          <Text fw={700} size='md'>
            {following}
          </Text>
          <Text c='dimmed' size='xs'>
            Följer
          </Text>
        </Stack>
      </Box>

      <Box px='xs' py='xs' className='stats'>
        <Stack align='center' gap='xs'>
          <Text fw={700} size='md'>
            {events}
          </Text>
          <Text c='dimmed' size='xs'>
            Event
          </Text>
        </Stack>
      </Box>
    </Group>
  );
}
