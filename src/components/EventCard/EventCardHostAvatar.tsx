import { Avatar } from '@mantine/core';
import { Link } from 'react-router-dom';

type User = {
  id: number;
  name: string;
  alias: string;
  profile_picture_url?: string;
};

interface EventCardHostAvatarProps {
  host: User | null;
}

export default function EventCardHostAvatar({
  host,
}: EventCardHostAvatarProps) {
  return (
    <Avatar
      component={Link}
      src={host?.profile_picture_url}
      to={`/profil/${host?.alias}`}
      alt='Host'
      radius='xl'
      size={56}
      className='hostAvatar'
      onClick={(e) => e.stopPropagation()}
    />
  );
}
