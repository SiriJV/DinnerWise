import { Box, Group, Image, Rating, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

type EventDetailsHostCardProps = {
  host: {
    name?: string;
    alias?: string;
    bio?: string;
    profile_picture_url?: string;
  } | null;
};

export default function EventDetailsHostCard({
  host,
}: EventDetailsHostCardProps) {
  const navigate = useNavigate();
  return (
    <Box
      className='hover-style'
      onClick={() => navigate(host ? `/profil/${host.alias}` : '/profil/')}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
      }}>
      <Box
        p='lg'
        bdrs='lg'
        bd='1px solid rgba(206, 212, 218, 1)'
        style={{ transition: '0.2s ease' }}>
        <Group align='center' gap='lg' wrap='nowrap'>
          <Image
            bdrs={100}
            src={
              host?.profile_picture_url ||
              'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
            }
            w={90}
            h={90}
            fit='cover'
          />

          <Stack gap='xs'>
            <Text fw={600}>{host?.name || 'Anders Blom'}</Text>
            <Rating
              value={3.5}
              fractions={2}
              readOnly
              color='rgba(211, 4, 59, 1)'
            />
            <Text size='sm' c='dimmed' lineClamp={3}>
              {host?.bio || 'Klicka för att läsa mer om värden.'}
            </Text>
            <Text size='xs' c='rgba(211, 4, 59, 1)'>
              Visa profil →
            </Text>
          </Stack>
        </Group>
      </Box>
    </Box>
  );
}
