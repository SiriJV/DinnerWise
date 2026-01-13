import './HeroImage.scss';

interface HeroImageProps {
  src: string;
  alt?: string;
  top?: boolean;
}

export default function HeroImage({
  src,
  alt = 'Hero image',
  top = false,
}: HeroImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`heroImage${top ? ' top-position' : ''}`}
    />
  );
}
