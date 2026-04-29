import { Box, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import './HeroImage.scss';
import SearchBar from '../SearchBar/SearchBar';

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
  const [loaded, setLoaded] = useState(false);

  return (
    <div className='heroWrapper'>
      {!loaded && (
        <Skeleton
          height='100%'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
          animate
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`heroImage ${position ? `${position}-position` : ''}`}
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
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

      <Box className='heroSearchBar' visibleFrom='sm'>
        <SearchBar />
      </Box>
    </div>
  );
}
