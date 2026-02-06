import ProfilePageImage from './ProfilePageImage';
import ProfilePageAvatar from './ProfilePageAvatar';
import { Box, Group, Stack, Text, Title } from '@mantine/core';
import ProfilePageStats from './ProfilePageStats';
import ProfilePageEvents from './ProfilePageEvents';
import { PenIcon, SettingsIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  alias: string;
  bio?: string;
  profile_picture_url?: string;
}

export default function ProfilePage() {
  const { alias } = useParams<{ alias: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`http://localhost:3001/users/alias/${alias}`);
        if (!res.ok) throw new Error('Kunde inte hämta användare');
        const data: User = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (alias) {
      loadUser();
    } else {
      setError('Ogiltigt alias');
      setLoading(false);
    }
  }, [alias]);

  if (loading) {
    return (
      <Text p='xl' ta='center' c='dimmed'>
        Laddar profil...
      </Text>
    );
  }

  if (error || !user) {
    return (
      <Text p='xl' ta='center' c='red'>
        {error || 'Användare hittades inte'}
      </Text>
    );
  }

  return (
    <>
      <Box pos='relative'>
        <ProfilePageImage
          src=''
          // {user.profile_banner_url}
          userId={user.id}
        />
        <ProfilePageAvatar src={user.profile_picture_url} />
        <ProfilePageStats followers={22} following={12} events={13} />
      </Box>
      <Stack m='md' gap='xs'>
        <Group justify='space-between'>
          <Title order={2} size='lg' fw='600'>
            {user.name}
          </Title>
          <Group gap='xs'>
            <PenIcon size='20px' />
            <SettingsIcon size='20px' />
          </Group>
        </Group>
        <Text>{user.bio || 'Ingen biografi ännu.'}</Text>
        <ProfilePageEvents />
      </Stack>
    </>
  );
}
