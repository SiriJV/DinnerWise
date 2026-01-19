import { Avatar } from '@mantine/core';
import './ProfilePage.scss';

type ProfilePageAvatarProps = {
  src?: string;
};

export default function ProfilePageAvatar({ src }: ProfilePageAvatarProps) {
  return (
    <Avatar
      src={src}
      size={120}
      pos='absolute'
      bottom={12.5}
      left={24}
      variant='filled'
      className='avatar'
    />
  );
}
