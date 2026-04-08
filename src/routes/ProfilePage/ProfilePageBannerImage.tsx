import { Box, Skeleton } from '@mantine/core';
import { useState } from 'react';

type ProfilePageBannerImageProps = {
  src?: string;
  alt?: string;
  userId?: number;
};

const gradients = [
  'linear-gradient(135deg, var(--mantine-color-cyan-2) 0%, var(--mantine-color-indigo-6) 100%)',
  'linear-gradient(135deg, var(--mantine-color-pink-2) 0%, var(--mantine-color-grape-6) 100%)',
  'linear-gradient(135deg, var(--mantine-color-lime-2) 0%, var(--mantine-color-teal-6) 100%)',
  'linear-gradient(135deg, var(--mantine-color-orange-2) 0%, var(--mantine-color-pink-5) 100%)',
  'linear-gradient(135deg, var(--mantine-color-yellow-2) 0%, var(--mantine-color-orange-5) 100%)',
];

export default function ProfilePageBannerImage({
  src,
  alt = 'Banner image',
  userId = 0,
}: ProfilePageBannerImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    const gradientIndex = userId % gradients.length;
    return (
      <Box
        h={250}
        style={{
          background: gradients[gradientIndex],
          width: '100%',
        }}
      />
    );
  }

  return (
    <Box style={{ position: 'relative', height: 250, width: '100%' }}>
      {!loaded && (
        <Skeleton
          height={250}
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
          height: 250,
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  );
}
