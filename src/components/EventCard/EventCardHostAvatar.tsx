import { Avatar, Box } from '@mantine/core';
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (host) {
      navigate(`/profil/${host.alias}`);
    }
  };

  return (
    <Box onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Avatar
        src={host?.profile_picture_url}
        alt='Host'
        radius='xl'
        size={56}
        className='hostAvatar'
      />
    </Box>
  );
}
