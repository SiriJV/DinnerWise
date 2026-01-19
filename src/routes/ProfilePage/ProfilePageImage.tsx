import { Image } from '@mantine/core';

type ProfilePageImageProps = {
  src?: string;
  alt?: string;
};

export default function ProfilePageImage({
  src,
  alt = 'Profile image',
}: ProfilePageImageProps) {
  return (
    <Image
      h={250}
      src={src}
      alt={alt}
      fit='cover'
      fallbackSrc='https://images.unsplash.com/photo-1557683311-eac922347aa1'
    />
  );
}
