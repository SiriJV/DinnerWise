import { Box, Skeleton } from '@mantine/core';
import { useState } from 'react';

type ProfilePageBannerImageProps = {
  src?: string;
  alt?: string;
  userId?: number;
};

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
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
