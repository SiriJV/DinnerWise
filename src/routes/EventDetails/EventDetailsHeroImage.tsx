import { AspectRatio } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

type EventDetailsHeroImageProps = {
  image: string;
};

export default function EventDetailsHeroImage({
  image,
}: EventDetailsHeroImageProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <AspectRatio
      ratio={isMobile ? 16 / 9 : 10 / 2}
      w='100%'
      mx='auto'
      bdrs='xs'>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
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
    </AspectRatio>
  );
}
