import { Flex, SimpleGrid } from '@mantine/core';
import EventCard from '../../components/EventCard/EventCard';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import './HomePage.scss';
import HeroImage from '../../components/HeroImage/HeroImage';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <HeroImage src='src/assets/hero-image.jpg' alt='Hero Image' top={true} />
      {/* <HeroImage src='src/assets/2.jpg' alt='Hero Image' />
      <HeroImage src='src/assets/3.jpg' alt='Hero Image' /> */}

      <Flex direction='column' gap='md' p='md'>
        <ImageCarousel />

        <SimpleGrid
          cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
          spacing='md'
          mt='lg'>
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </SimpleGrid>
      </Flex>
    </>
  );
}
