import { Box, Group, Image, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import RatingComponent from '../../components/RatingComponent/RatingComponent';
import { getRating } from '../../utils/getRating';

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
        bd='1px solid gray.4'
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
            <RatingComponent
              value={getRating(host)}
              fractions={2}
              readOnly={true}
            />
            <Text size='sm' c='dimmed' lineClamp={3}>
              {host?.bio || 'Klicka för att läsa mer om värden.'}
            </Text>
            <Text size='xs' c='red'>
              Visa profil →
            </Text>
          </Stack>
        </Group>
      </Box>
    </Box>
  );
}
