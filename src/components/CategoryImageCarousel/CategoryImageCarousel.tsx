import { Carousel } from '@mantine/carousel';
import { Box, Card, Image, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@mantine/carousel/styles.css';
import './CategoryImageCarousel.scss';
import { useEffect, useState } from 'react';
import { slugify } from '../../utils/slugify';

type Category = {
  id: number;
  name: string;
  description?: string;
  cover_picture_url?: string;
};

export default function NavCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('http://localhost:3001/categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

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
          xs: '50%',
          sm: '33.3333%',
          md: '25%',
          lg: '20%',
        }}
        nextControlIcon={<ChevronRight size={28} />}
        previousControlIcon={<ChevronLeft size={28} />}>
        {categories.map((category) => (
          <Carousel.Slide key={category.id}>
            <Link
              to={`/kategori/${slugify(category.name)}`}
              className='navCarousel-link'>
              <Card radius='0' padding={0} className='navCarousel-card'>
                <Image src={category.cover_picture_url} h={110} fit='cover' />
                <Text className='navCarousel-label'>{category.name}</Text>
              </Card>
            </Link>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
