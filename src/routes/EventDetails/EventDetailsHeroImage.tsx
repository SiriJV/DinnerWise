import { AspectRatio, Skeleton, Box } from '@mantine/core';
import { useIsMobile } from '../../hooks/useResponsive';
import { useState } from 'react';

type EventDetailsHeroImageProps = {
  image: string;
};

export default function EventDetailsHeroImage({
  image,
}: EventDetailsHeroImageProps) {
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);

  return (
    <AspectRatio
      ratio={isMobile ? 16 / 9 : 10 / 2}
      w='100%'
      mx='auto'
      bdrs='xs'>
      <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
        {!loaded && (
          <Skeleton
            height='100%'
            width='100%'
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            animate
          />
        )}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}>
          {/* Blur background (bara desktop) */}
          {!isMobile && (
            <img
              src={image}
              alt='Event background'
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(30px)',
                transform: 'scale(1.1)',
              }}
            />
          )}

          {/* Main image */}
          <img
            src={image}
            alt='Event'
            onLoad={() => setLoaded(true)}
            style={{
              position: 'relative',
              width: isMobile ? '100%' : 'auto',
              height: '100%',
              maxWidth: '100%',
              margin: '0 auto',
              display: 'block',
              objectFit: isMobile ? 'cover' : 'contain',
            }}
          />
        </div>
      </Box>
    </AspectRatio>
  );
}
