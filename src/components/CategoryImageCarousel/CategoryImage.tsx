import { Box, Skeleton } from '@mantine/core';
import { useState } from 'react';

export default function CategoryImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box style={{ height: 110, position: 'relative', overflow: 'hidden' }}>
      {!loaded && (
        <Skeleton
          height={110}
          radius='md'
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
          animate
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: 110,
          objectFit: 'cover',
          display: 'block',
          opacity: loaded ? 1 : 0,
        }}
      />
    </Box>
  );
}
