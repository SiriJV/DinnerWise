import { Box, Button, Grid, Group, Text } from '@mantine/core';
import { FlagIcon, Share } from 'lucide-react';
import BookmarkButton from '../../components/BookmarkIcon/BookmarkIcon';

type Props = {
  isFull: boolean;
  isLoggedIn: boolean;
  eventId: number;
  register: any;
  share: any;
};

export default function EventActions({
  isFull,
  isLoggedIn,
  eventId,
  register,
  share,
}: Props) {
  return (
    <Grid gutter='xl' mt='xl' align='flex-end'>
      <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
        <Group gap='xs'>
          <FlagIcon color='rgba(211, 4, 59, 1)' />
          <Text size='sm' c='red'>
            Rapportera event
          </Text>
        </Group>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
        <Group w='100%' align='stretch' gap='md' wrap='wrap'>
          <Button size='md' style={{ flex: 1 }} onClick={register.open}>
            {isFull ? 'Skriv upp dig på väntelista' : 'Anmäl dig här'}
          </Button>

          {isLoggedIn && <BookmarkButton eventId={eventId} variant='lg' />}
          <Box
            onClick={share.open}
            bg='gray.3'
            w='44px'
            h='44px'
            style={{
              cursor: 'pointer',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Share size={22} color='black' style={{ display: 'block' }} />
          </Box>
        </Group>
      </Grid.Col>
    </Grid>
  );
}
