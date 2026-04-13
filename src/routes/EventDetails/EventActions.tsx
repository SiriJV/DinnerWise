import { ActionIcon, Button, Grid, Group, Text } from '@mantine/core';
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
          <ActionIcon
            onClick={share.open}
            radius='xl'
            size={44}
            variant='filled'
            color='gray.3'>
            <Share size={22} color='black' />
          </ActionIcon>
        </Group>
      </Grid.Col>
    </Grid>
  );
}
