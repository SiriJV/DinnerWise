import { useState } from 'react';
import { Modal, SimpleGrid, Box } from '@mantine/core';

type RestaurantPhotosProps = {
  photos?: string;
};

export default function RestaurantPhotos({ photos }: RestaurantPhotosProps) {
  const [openedImage, setOpenedImage] = useState<string | null>(null);
  let photosArr: string[] = [];
  if (typeof photos === 'string') {
    try {
      const parsed = JSON.parse(photos);
      if (Array.isArray(parsed)) photosArr = parsed;
    } catch {}
  }
  if (photosArr.length === 0) return null;
  return (
    <>
      <SimpleGrid cols={{ base: 2, md: 5 }} spacing='xs' mb='md' mt='lg'>
        {photosArr.map((url, idx) => (
          <Box
            key={idx}
            style={{
              aspectRatio: '1/1',
              overflow: 'hidden',
              borderRadius: 8,
              border: '1px solid #eee',
              cursor: 'pointer',
            }}
            onClick={() => setOpenedImage(url)}>
            <img
              src={url}
              alt={`Restaurangbild ${idx + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        ))}
      </SimpleGrid>
      <Modal
        opened={!!openedImage}
        onClose={() => setOpenedImage(null)}
        centered
        size='auto'
        withCloseButton={false}
        styles={{
          content: {
            padding: 0,
            background: 'transparent',
            boxShadow: 'none',
            marginTop: 90,
          },
        }}>
        {openedImage && (
          <img
            src={openedImage}
            alt='Restaurangbild stor'
            style={{
              maxWidth: '80vw',
              maxHeight: '75vh',
              display: 'block',
              margin: '0 auto',
              borderRadius: 12,
            }}
          />
        )}
      </Modal>
    </>
  );
}
