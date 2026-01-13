import { Carousel } from '@mantine/carousel';
import { Box, Card, Image, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@mantine/carousel/styles.css';
import { navLinks } from '../../data/NavLinks';
import './ImageCarousel.scss';

export default function NavCarousel() {
  return (
    <Box>
      <Text fw={700} pb='xs'>
        Populära kategorier
      </Text>
      <Carousel
        slideGap='md'
        emblaOptions={{ align: 'start', loop: true }}
        slideSize={{
          base: '100%',
          sm: '50%',
          md: '33.3333%',
          lg: '16.6667%',
        }}
        nextControlIcon={<ChevronRight size={32} />}
        previousControlIcon={<ChevronLeft size={32} />}>
        {navLinks.map((link) => (
          <Carousel.Slide key={link.path}>
            <NavLink to={`/${link.path}`} className='navCarousel-link'>
              <Card radius='0' padding={0} className='navCarousel-card'>
                <Image src={link.image} h={160} fit='cover' radius='md' />
                <Text fw='600' className='navCarousel-label'>
                  {link.label}
                </Text>
              </Card>
            </NavLink>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
