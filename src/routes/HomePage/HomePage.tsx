import { Image } from '@mantine/core';
import './HomePage.scss';
import EventCard from '../../components/EventCard/EventCard';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <Image radius='0' h='50vh' src='src\assets\9010.jpg' />
      <EventCard />
    </>
  );
}
