import { Image } from '@mantine/core';
import FUlogoKVGbgsmaller from '../../assets/FUlogos/FUlogoKVGbgsmaller.png';
import { Link } from 'react-router-dom';

interface FooterFULogoProps {
  hiddenFromSmall: Boolean;
}

export default function FooterFULogo({
  hiddenFromSmall = true,
}: FooterFULogoProps) {
  const FULink = 'https://www.folkuniversitetet.se/';

  return (
    <Link to={FULink}>
      <Image
        mt='md'
        src={FUlogoKVGbgsmaller}
        alt='Folkuniversitetet logo'
        w={200}
        fit='contain'
        hiddenFrom={hiddenFromSmall ? 'sm' : undefined}
        visibleFrom={!hiddenFromSmall ? 'sm' : undefined}
      />
    </Link>
  );
}
