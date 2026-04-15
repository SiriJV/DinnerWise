import {
  Avatar,
  Box,
  Button,
  Divider,
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
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [userName, setUserName] = useState('');
  const [userAlias, setUserAlias] = useState('');
  const [userBio, setUserBio] = useState('');
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const isFocused = (field: string) => focusedField === field;

  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const [activeSection, setActiveSection] = useState('profile');

  const clearFile = () => {
    setFile(null);
    resetRef.current?.();
  };

  useEffect(() => {
    async function loadUser() {
      if (!alias) {
        setError('Ogiltigt alias');
        return;
      }

      const data = await fetchUserByAlias(alias);
      if (!data) {
        setError('Användare hittades inte');
      } else {
        setUser(data);
      }
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

  const handleResetChanges = () => {
    setUserName(originalUser?.name || '');
    setUserAlias(originalUser?.alias || '');
    setUserBio(originalUser?.bio || '');
  };

  if (error || !user || !isLoggedIn) {
    return (
      <Text p='xl' ta='center' c='red'>
        {error || 'Sidan finns inte eller du har inte behörighet att se den.'}
      </Text>
    );
  }

  const MenuItem = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: string;
    color?: string;
  }) => (
    <UnstyledButton
      onClick={() => setActiveSection(value)}
      px='sm'
      py='xs'
      bdrs='sm'
      c={color ? color : 'black'}
      style={{
        background:
          activeSection === value ? 'rgba(0,0,0,0.05)' : 'transparent',
      }}>
      <Text size='sm' fw={activeSection === value ? 600 : 400}>
        {label}
      </Text>
    </UnstyledButton>
  );

  return (
    <>
      {isLoggedIn && user.id === 1 && (
        <Box p='md'>
          <Group align='flex-start' gap='xl'>
            {/* SIDEBAR */}
            <Box w='100%' maw={{ base: '100%', sm: 300 }}>
              {' '}
              <Stack gap='lg'>
                <Stack gap='xs'>
                  <Text size='xs' fw={600} tt='uppercase'>
                    Profil
                  </Text>
                  <MenuItem label='Personuppgifter' value='profile' />
                  <MenuItem label='Inloggning' value='login' />
                  <MenuItem label='Behörigheter' value='permissions' />
                </Stack>

                <Stack gap='xs'>
                  <Text size='xs' fw={600} tt='uppercase'>
                    Preferenser
                  </Text>
                  <MenuItem label='Inställningar' value='preferences' />
                  <MenuItem label='Bevakningar' value='watch' />
                </Stack>

                <Stack gap='xs'>
                  <Text size='xs' fw={600} tt='uppercase'>
                    Interaktion
                  </Text>
                  <MenuItem label='Blockerade' value='blocked' />
                </Stack>

                <Divider />

                <MenuItem label='Radera konto' value='delete' color='red' />
              </Stack>
            </Box>

            {/* CONTENT */}
            <Box style={{ flex: 1 }}>
              <Box p='md' bdrs='sm' bd='1px solid gray.4'>
                <Stack gap='lg'>
                  <Group justify='space-between'>
                    <Title order={3}>
                      Inställningar för {user.name} ({user.alias})
                    </Title>
                    <Button onClick={() => navigate(-1)}>Tillbaka</Button>
                  </Group>

                  {/* PROFILE SECTION */}
                  {activeSection === 'profile' && (
                    <>
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
                                />
                                <Button {...props}>Ändra profilbild</Button>
                              </Group>
                            )}
                          </FileButton>

                          <Button disabled={!file} onClick={clearFile}>
                            Rensa
                          </Button>
                        </Group>

                        {!file && (
                          <Text size='sm'>Godkända filformat: jpg, png</Text>
                        )}

                        {file && <Text size='sm'>Vald fil: {file.name}</Text>}
                      </Stack>

                      <Group justify='space-between'>
                        <Button
                          onClick={handleResetChanges}
                          disabled={!hasChanged}
                          variant='light'>
                          Rensa ändringar
                        </Button>

                        <Button disabled={!hasChanged}>Spara</Button>
                      </Group>
                    </>
                  )}

                  {/* PLACEHOLDER SECTIONS */}
                  {activeSection !== 'profile' && (
                    <Text c='dimmed'>
                      Denna sektion är inte implementerad ännu.
                    </Text>
                  )}
                </Stack>
              </Box>
            </Box>
          </Group>
        </Box>
      )}
    </>
  );
}
