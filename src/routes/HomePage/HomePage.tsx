import { Flex, Image } from '@mantine/core';
import './HomePage.scss';
import EventCard from '../../components/EventCard/EventCard';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <Image radius='0' h='50vh' src='src\assets\9010.jpg' />
      <Flex direction='column' gap='md' p='md'>
        <ImageCarousel />
        <Flex w='100%' gap='md' justify='space-between'>
          <EventCard />
          <EventCard />

          <EventCard />
        </Flex>
      </Flex>
    </>
  );
}
