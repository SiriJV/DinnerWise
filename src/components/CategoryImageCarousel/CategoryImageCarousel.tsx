import { Carousel } from '@mantine/carousel';
import { Anchor, Box, Card, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@mantine/carousel/styles.css';
import './CategoryImageCarousel.scss';
import { useEffect, useState } from 'react';
import { slugify } from '../../utils/slugify';
import CategoryImage from './CategoryImage';

type Category = {
  id: number;
  name: string;
  description?: string;
  cover_picture_url?: string;
};

export default function CategoryImageCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('http://localhost:3001/categories');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        
        // Validate that response is an array
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.warn('CategoryImageCarousel: API response is not an array', data);
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  if (categories.length === 0) {
    return null;
  }

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
            <Anchor
              component={Link}
              to={`/kategori/${slugify(category.name)}`}
              c='black'>
              <Card radius='0' padding={0} className='navCarousel-card'>
                <CategoryImage
                  src={category.cover_picture_url}
                  alt={category.name}
                />
                {category.name}
              </Card>
            </Anchor>
            {/* </Link> */}
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
