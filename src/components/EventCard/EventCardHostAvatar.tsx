import { Avatar } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  return (
    <Avatar
      src={host?.profile_picture_url}
      alt='Host'
      radius='xl'
      size={56}
      className='hostAvatar'
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/profil/${host?.alias}`);
      }}
    />
  );
}
