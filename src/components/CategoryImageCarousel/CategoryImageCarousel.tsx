import { Carousel } from '@mantine/carousel';
import { Box, Card, Text, Title, Skeleton } from '@mantine/core';
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

function CategoryImage({ src, alt }: { src?: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box style={{ height: 110, position: 'relative', overflow: 'hidden' }}>
      {!loaded && (
        <Skeleton
          height={110}
          radius='md'
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
          animate
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: 110,
          objectFit: 'cover',
          display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  );
}

export default function CategoryImageCarousel() {
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
            <Link
              to={`/kategori/${slugify(category.name)}`}
              className='navCarousel-link'>
              <Card radius='0' padding={0} className='navCarousel-card'>
                <CategoryImage
                  src={category.cover_picture_url}
                  alt={category.name}
                />
                <Text className='navCarousel-label'>{category.name}</Text>
              </Card>
            </Link>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
