import { Avatar } from '@mantine/core';

interface EventCardHostAvatarProps {
  pic_url: string;
}

export default function EventCardHostAvatar({
  pic_url,
}: EventCardHostAvatarProps) {
  return (
    <Avatar
      src={pic_url}
      alt='Host'
      radius='xl'
      size={56}
      className='hostAvatar'
    />
  );
}
