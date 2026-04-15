import {
  Avatar,
  Box,
  Button,
  Container,
  FileButton,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { fetchUserByAlias, type User } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePageSettings() {
  const { alias } = useParams<{ alias: string }>();
  const { isLoggedIn } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userAlias, setUserAlias] = useState('');
  const [userBio, setUserBio] = useState('');
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const isFocused = (field: string) => focusedField === field;

  const [file, setFile] = useState<File | null>(null);

  const resetRef = useRef<() => void>(null);

  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      if (!alias) {
        setError('Ogiltigt alias');
        // setLoading(false);
        return;
      }

      const data = await fetchUserByAlias(alias);
      if (!data) {
        setError('Användare hittades inte');
      } else {
        setUser(data);
      }
      // setLoading(false);
    }

    loadUser();
  }, [alias]);

  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setUserAlias(user.alias);
      setUserBio(user.bio || '');
      setOriginalUser(user);
    }
  }, [user]);

  const hasChanged =
    userName !== originalUser?.name ||
    userAlias !== originalUser?.alias ||
    userBio !== (originalUser?.bio || '');

  if (error || !user || !isLoggedIn) {
    return (
      <Text p='xl' ta='center' c='red'>
        {error || 'Sidan finns inte eller du har inte behörighet att se den.'}
      </Text>
    );
  }

  const handleResetChanges = () => {
    setUserName(originalUser?.name || '');
    setUserAlias(originalUser?.alias || '');
    setUserBio(originalUser?.bio || '');
  };

  // const handleSave = () => {
  //   setUser((prev) =>
  //     prev
  //       ? {
  //           ...prev,
  //           name: userName,
  //           alias: userAlias,
  //           bio: userBio,
  //         }
  //       : prev,
  //   );

  //   setOriginalUser((prev) =>
  //     prev
  //       ? {
  //           ...prev,
  //           name: userName,
  //           alias: userAlias,
  //           bio: userBio,
  //         }
  //       : prev,
  //   );
  // };

  return (
    <>
      {isLoggedIn && user.id === 1 && (
        <Box>
          <Container size='sm' pt='md'>
            <Stack gap='xs' w='100%'>
              <Stack mb='lg' gap='lg'>
                <Group justify='space-between' mt='md'>
                  <Title order={2}>
                    Inställningar för {user.name} ({user.alias})
                  </Title>
                  <Button onClick={() => navigate(-1)}>Tillbaka</Button>
                </Group>
                {/* <Group> */}
                <TextInput
                  label='Namn'
                  value={userName}
                  onChange={(e) => setUserName(e.currentTarget.value)}
                  variant={isFocused('name') ? 'default' : 'filled'}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />

                <TextInput
                  label='Användarnamn'
                  value={userAlias}
                  onChange={(e) => setUserAlias(e.currentTarget.value)}
                  variant={isFocused('alias') ? 'default' : 'filled'}
                  onFocus={() => setFocusedField('alias')}
                  onBlur={() => setFocusedField(null)}
                />

                <TextInput
                  label='Beskrivning'
                  value={userBio}
                  onChange={(e) => setUserBio(e.currentTarget.value)}
                  variant={isFocused('bio') ? 'default' : 'filled'}
                  onFocus={() => setFocusedField('bio')}
                  onBlur={() => setFocusedField(null)}
                />
                <Stack gap='xs'>
                  <Group align='flex-end'>
                    <FileButton
                      onChange={setFile}
                      accept='image/png,image/jpeg'>
                      {(props) => (
                        <Group align='flex-end'>
                          <Avatar
                            size='lg'
                            component={UnstyledButton}
                            src={user.profile_picture_url}
                            radius='sm'
                            {...props}
                          />{' '}
                          <Button {...props}>Ändra profilbild</Button>
                        </Group>
                      )}
                    </FileButton>
                    <Button disabled={!file} onClick={clearFile}>
                      Rensa
                    </Button>
                  </Group>

                  {!file && <Text size='sm'>Godkända filformat: jpg, png</Text>}

                  {file && <Text size='sm'>Vald fil: {file.name}</Text>}
                </Stack>
                {/* <PenIcon size='16px' /> */}
                {/* </Group> */}
                <Group justify='space-between'>
                  <Button
                    onClick={handleResetChanges}
                    disabled={!hasChanged}
                    variant='light'>
                    Rensa ändringar
                  </Button>{' '}
                  <Button
                    // onClick={handleSave}
                    disabled={!hasChanged}>
                    Spara
                  </Button>
                </Group>
              </Stack>
            </Stack>
          </Container>
        </Box>
      )}
    </>
  );
}
