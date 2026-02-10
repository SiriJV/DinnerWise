import ProfilePageImage from './ProfilePageBannerImage';
import ProfilePageAvatar from './ProfilePageAvatar';
import { Box, Group, Stack, Text, Title } from '@mantine/core';
import ProfilePageStats from './ProfilePageStats';
import ProfilePageEvents from './ProfilePageEvents';
import { PenIcon, SettingsIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserByAlias, type User } from '../../api/users';

export default function ProfilePage() {
  const { alias } = useParams<{ alias: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!alias) {
        setError('Ogiltigt alias');
        setLoading(false);
        return;
      }

      const data = await fetchUserByAlias(alias);
      if (!data) {
        setError('Användare hittades inte');
      } else {
        setUser(data);
      }
      setLoading(false);
    }

    loadUser();
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
        <ProfilePageImage src={user.banner_picture_url} userId={user.id} />
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
