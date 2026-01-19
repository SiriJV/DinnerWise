import ProfilePageImage from './ProfilePageImage';
import ProfilePageAvatar from './ProfilePageAvatar';
import { Box, Stack, Text } from '@mantine/core';
import ProfilePageStats from './ProfilePageStats';
import ProfilePageEvents from './ProfilePageEvents';

export default function ProfilePage() {
  return (
    <>
      <Box pos='relative'>
        <ProfilePageImage src='https://images.unsplash.com/photo-1691603136890-af95b6ba3eef'></ProfilePageImage>
        <ProfilePageAvatar src='https://plus.unsplash.com/premium_photo-1732450236324-8ba08aa1f769' />
        <ProfilePageStats followers={22} following={12} events={13} />
      </Box>
      <Stack m='xl'>
        <Text>Linda Larsson 💗</Text>
        <Text>
          Bor i Göteborg. Intresserad av hållbarhet, friluftsliv och kreativt
          skrivande. Älskar att upptäcka nya platser och lära mig nya språk.
        </Text>
        <ProfilePageEvents />
      </Stack>
    </>
  );
}
