import { AspectRatio } from '@mantine/core';

type EventDetailsHeroImageProps = {
  image: string;
};

export default function EventDetailsHeroImage({
  image,
}: EventDetailsHeroImageProps) {
  return (
    <AspectRatio ratio={10 / 2} w='100%' mx='auto'>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}>
        {/* 🔹 Blur background */}
        <img
          src={image}
          alt='Event background'
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(30px)',
            transform: 'scale(1.1)',
          }}
        />

        {/* 🔹 Sharp centered image */}
        <img
          src={image}
          alt='Event'
          style={{
            position: 'relative',
            height: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            display: 'block',
            objectFit: 'contain',
          }}
        />
      </div>
    </AspectRatio>
  );
}

// import { AspectRatio } from '@mantine/core';

// type EventDetailsHeroImageProps = {
//   eventId: number;
// };

// const heroImages = [
//   'https://images.unsplash.com/photo-1651981135359-7731f39d9460?q=80&w=1600&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1701203236447-89a7016a5a40?q=80&w=1600&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1651981101695-219fa3653bf1?q=80&w=1600&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1600&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1558383441-bc4e2dc8cd4b?q=80&w=1600&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1571989569149-250bd32f5eb5?q=80&w=1600&auto=format&fit=crop',
// ];

// export default function EventDetailsHeroImage({
//   eventId,
// }: EventDetailsHeroImageProps) {
//   const imageIndex = eventId % heroImages.length;
//   const selectedImage = heroImages[imageIndex];

//   return (
//     <AspectRatio ratio={10 / 2} w='100%' mx='auto'>
//       <img
//         src={selectedImage}
//         alt='Event hero'
//         style={{
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           objectPosition: 'center',
//           display: 'block',
//         }}
//       />
//     </AspectRatio>
//   );
// }
