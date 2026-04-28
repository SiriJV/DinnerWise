import { Image } from '@mantine/core';
import FUlogoKVGbgsmaller from '../../assets/FUlogos/FUlogoKVGbgsmaller.png';

interface FooterFULogoProps {
  hiddenFromSmall: Boolean;
}

export default function FooterFULogo({
  hiddenFromSmall = true,
}: FooterFULogoProps) {
  if (hiddenFromSmall) {
    return (
      <Image
        mt={'md'}
        hiddenFrom='sm'
        src={FUlogoKVGbgsmaller}
        alt='Swish'
        w={'auto'}
        mah={30}
        fit='contain'
      />
    );
  }

  return (
    <Image
      mt={'md'}
      visibleFrom='sm'
      src={FUlogoKVGbgsmaller}
      alt='Swish'
      w={'auto'}
      mah={50}
      fit='contain'
      mr={'xl'}
    />
  );
}
