import { Flex, Image, SimpleGrid } from '@mantine/core';
import EventCard from '../../components/EventCard/EventCard';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import './HomePage.scss';

export default function HomePage(): React.ReactNode {
  return (
    <>
      {/* <Image
        className='heroImage'
        radius={0}
        h='50vh'
        src='src/assets/4087.jpg'
        // fit='cover'
      /> */}

      {/* <Image
        className='heroImage'
        radius={0}
        height='50vh'
        src='src/assets/4087.jpg'
        fit='cover'
        styles={{
          image: {
            objectPosition: 'top',
          },
        }}
      /> */}
      <img src='src/assets/4087.jpg' className='heroImage' alt='Hero image' />

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
