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
  if (hiddenFromSmall) {
    return (
      <Link to={FULink}>
        <Image
          mt={'md'}
          hiddenFrom='sm'
          src={FUlogoKVGbgsmaller}
          alt='Folkuniversitetet logo'
          w={'200'}
          mah={30}
          fit='contain'
        />
      </Link>
    );
  }

  return (
    <Link to={FULink}>
      <Image
        mt={'md'}
        visibleFrom='sm'
        src={FUlogoKVGbgsmaller}
        alt='Folkuniversitetet logo'
        w={'200'}
        fit='contain'
      />
    </Link>
  );
}
