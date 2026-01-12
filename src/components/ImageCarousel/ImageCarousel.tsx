import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';
import '@mantine/carousel/styles.css';

const images = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  'https://images.unsplash.com/photo-1494526585095-c41746248156',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
  'https://images.unsplash.com/photo-1526772662000-3f88f10405ff',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
];

export default function ImageCarousel() {
  return (
    <Carousel
      withControls
      slideGap='md'
      // loop
      emblaOptions={{ align: 'start' }}
      slideSize={{
        base: '100%', // mobil
        sm: '50%', // tablet
        md: '33.3333%', // 3
        lg: '16.6667%', // 6 på desktop
      }}>
      {images.map((src, index) => (
        <Carousel.Slide key={index}>
          <Image
            src={src}
            h={160}
            radius='md'
            fit='cover'
            alt={`Slide ${index + 1}`}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
