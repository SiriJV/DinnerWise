import { Box, Skeleton } from '@mantine/core';
import { useState } from 'react';

type SkeletonImageComponentProps = {
  url: string;
  alt: string;
  maxHeight?: string;
  readOnly?: boolean;
  onChange?: (value: number) => void;
};

export default function SkeletonImageComponent({
  url,
  alt,
  maxHeight,
}: SkeletonImageComponentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Box style={{ position: 'relative', minHeight: 250 }}>
      {!imageLoaded && (
        <Skeleton
          height='100%'
          radius='md'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          animate
        />
      )}
      <img
        src={url}
        alt={alt}
        onLoad={() => setImageLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          maxHeight: maxHeight,
          objectFit: 'cover',
          objectPosition: '75% 20%',
          borderRadius: 'var(--mantine-radius-md)',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  );
}
