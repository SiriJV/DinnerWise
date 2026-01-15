import { Paper, Stack, Text } from '@mantine/core';
import './HeroImage.scss';

type HeroImageProps = {
  src: string;
  alt?: string;
  position?: 'top' | 'center' | 'bottom';
};

export default function HeroImage({
  src,
  alt = 'Hero image',
  position = 'top',
}: HeroImageProps) {
  return (
    <div className='heroWrapper'>
      <img
        src={src}
        alt={alt}
        className={`heroImage ${position ? `${position}-position` : ''}`}
      />

      <Paper className='heroOverlay' p='lg'>
        <Stack gap='xs'>
          <Text fw={700} size='lg' c='white'>
            Små event, stora upplevelser.
          </Text>
          <Text size='sm' c='white'>
            Möt nya människor, utforska intressen och dela god mat i en
            avslappnad miljö.
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}
