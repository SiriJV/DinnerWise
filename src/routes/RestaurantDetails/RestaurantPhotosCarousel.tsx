import { Carousel } from '@mantine/carousel';
import { Box, Stack, Image } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

type RestaurantPhotosCarouselProps = {
  photos: string[];
  restaurant?: { cover_picture_url?: string };
};

export default function RestaurantPhotosCarousel({
  photos,
  restaurant,
}: RestaurantPhotosCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const emblaApiRef = useRef<any>(null);

  // Enkel autoplay för karusellen
  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    setCurrentSlide(0); // starta alltid från första bilden när nya bilder laddas
    const max = Math.min(photos.length, 5);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % max);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length]);

  // Synka embla-carousel till rätt slide när currentSlide ändras
  useEffect(() => {
    if (
      emblaApiRef.current &&
      typeof emblaApiRef.current.scrollTo === 'function'
    ) {
      emblaApiRef.current.scrollTo(currentSlide);
    }
  }, [currentSlide]);

  return (
    <Box style={{ flex: 1, minWidth: '300px' }}>
      {photos.length > 1 ? (
        <Stack>
          <Carousel
            withIndicators
            height={250}
            slideSize='100%'
            styles={{ indicator: { background: '#333' } }}
            withControls={false}
            emblaOptions={{ loop: true }}
            getEmblaApi={(api) => {
              emblaApiRef.current = api;
            }}
            onSlideChange={setCurrentSlide}>
            {photos.slice(0, 5).map((photo, idx) => (
              <Carousel.Slide key={idx}>
                <Image
                  src={photo}
                  className='restaurant-image'
                  height={250}
                  fit='cover'
                  bdrs='md'
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Stack>
      ) : (
        <Image
          src={
            photos[0] ||
            (restaurant && restaurant.cover_picture_url) ||
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
          }
          className='restaurant-image'
          height={250}
          fit='cover'
          bdrs='md'
        />
      )}
    </Box>
  );
}
