import { Button } from '@mantine/core';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 600) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      radius='xl'
      size='lg'
      style={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        borderRadius: '50%',
        padding: 0,
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}
      aria-label='Tillbaka till toppen'>
      <ArrowUp size={28} />
    </Button>
  );
}
