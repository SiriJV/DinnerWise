import { Grid, Group, Text } from '@mantine/core';
import { FlagIcon, Share } from 'lucide-react';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
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
          <BaseButton size='md' style={{ flex: 1 }} onClick={register.open}>
            {isFull ? 'Skriv upp dig på väntelista' : 'Anmäl dig här'}
          </BaseButton>

          {isLoggedIn && <BookmarkButton eventId={eventId} variant='lg' />}

          <div
            onClick={share.open}
            style={{
              cursor: 'pointer',
              background: 'rgba(206, 212, 218, 1)',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Share size={22} style={{ display: 'block' }} />
          </div>
        </Group>
      </Grid.Col>
    </Grid>
  );
}
