import { Carousel } from '@mantine/carousel';
import { Box, Card, Image, Text, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@mantine/carousel/styles.css';
import { categoryLinks } from '../../data/NavLinks';
import './ImageCarousel.scss';

export default function NavCarousel() {
  return (
    <Box>
      <Title order={2} pb='xs'>
        Populära kategorier
      </Title>
      <Carousel
        slideGap='md'
        emblaOptions={{ align: 'start', loop: true }}
        slideSize={{
          base: '100%',
          sm: '50%',
          md: '33.3333%',
          lg: '20%',
        }}
        nextControlIcon={<ChevronRight size={28} />}
        previousControlIcon={<ChevronLeft size={28} />}>
        {categoryLinks.map((link) => (
          <Carousel.Slide key={link.path}>
            <NavLink to={link.path} className='navCarousel-link'>
              <Card radius='0' padding={0} className='navCarousel-card'>
                <Image src={link.image} h={110} fit='cover' />
                <Text className='navCarousel-label'>{link.label}</Text>
              </Card>
            </NavLink>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
