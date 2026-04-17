import {
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { fetchUserByAlias, type User } from '../../../api/users';
import { useAuth } from '../../../contexts/AuthContext';
import DemoWarningText from '../../../components/DemoWarningText/DemoWarningText';
import type { Category } from '../../../api/categories';

import ProfileSection from './sections/ProfileSection';
import LoginSection from './sections/LoginSection';
import PermissionsSection from './sections/PermissionsSection';
import PreferencesSection from './sections/PreferencesSection';
import WatchSection from './sections/WatchSection';
import { fetchTags, type Tag } from '../../../api/tags';
import InviteSection from './sections/InviteSection';
import BlockedSection from './sections/BlockedSection';
import DeleteSection from './sections/DeleteSection';
import NotificationsSettings from './sections/NotificationsSection';

export default function Settings() {
  const { alias } = useParams<{ alias: string }>();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    alias: '',
    bio: '',
    email: '',
    password: '',
    deletePassword: '',
    language: 'Svenska',
    theme: 'Ljust',
    timezone: 'Europe/Stockholm',
  });

  const [originalForm, setOriginalForm] = useState<typeof form | null>(null);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const isFocused = (field: string) => focusedField === field;

  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const [activeSection, setActiveSection] = useState('profile');

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
      const data = {
        name: user.name,
        alias: user.alias,
        bio: user.bio || '',
        email: 'example@email.com',
        password: 'password123',
        deletePassword: '',
        language: 'Svenska',
        theme: 'Ljust',
        timezone: 'Europe/Stockholm',
      };

      setForm(data);
      setOriginalForm(data);
    }
  }, [user]);

  const hasChanged = JSON.stringify(form) !== JSON.stringify(originalForm);

  const handleResetChanges = () => {
    if (originalForm) setForm(originalForm);
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    async function loadCategoriesAndTags() {
      try {
        const [catRes, tagsData] = await Promise.all([
          fetch('http://localhost:3001/categories'),
          fetchTags(),
        ]);
        const data: Category[] = await catRes.json();
        setCategories(data);
        setTags(tagsData);
      } catch (err) {
        console.error('Failed to load categories or tags:', err);
      }
    }
    loadCategoriesAndTags();
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
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
              <Stack gap='lg'>
                <Stack gap='xs'>
                  <Text size='xs' fw={600} tt='uppercase'>
                    Profil
                  </Text>
                  <MenuItem label='Profiluppgifter' value='profile' />
                  <MenuItem label='Inloggning' value='login' />
                  <MenuItem label='Behörigheter' value='permissions' />
                </Stack>

                <Stack gap='xs'>
                  <Text size='xs' fw={600} tt='uppercase'>
                    Preferenser
                  </Text>
                  <MenuItem label='Allmänt' value='preferences' />
                  <MenuItem label='Aviseringar' value='notifications' />

                  <MenuItem label='Bevakningar' value='watch' />
                </Stack>

                <Stack gap='xs'>
                  <Text size='xs' fw={600} tt='uppercase'>
                    Interaktion
                  </Text>
                  <MenuItem label='Bjud in vänner' value='invite' />
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
                    <DemoWarningText text='Ändringar sparas inte.' />
                    <Button onClick={() => navigate(-1)}>Tillbaka</Button>
                  </Group>

                  {activeSection === 'watch' ? (
                    <Stack>
                      <WatchSection
                        categories={categories}
                        tags={tags}
                        selectedCategories={selectedCategories}
                        toggleCategory={toggleCategory}
                      />
                    </Stack>
                  ) : (
                    <Stack maw={400}>
                      {activeSection === 'profile' && (
                        <ProfileSection
                          form={form}
                          handleChange={handleChange}
                          isFocused={isFocused}
                          setFocusedField={setFocusedField}
                          file={file}
                          setFile={setFile}
                          clearFile={clearFile}
                          user={user}
                        />
                      )}

                      {activeSection === 'login' && (
                        <LoginSection
                          form={form}
                          handleChange={handleChange}
                          isFocused={isFocused}
                          setFocusedField={setFocusedField}
                        />
                      )}

                      {activeSection === 'permissions' && (
                        <PermissionsSection />
                      )}

                      {activeSection === 'preferences' && (
                        <PreferencesSection
                          form={form}
                          handleChange={handleChange}
                        />
                      )}

                      {activeSection === 'notifications' && (
                        <NotificationsSettings activeSection={activeSection} />
                      )}

                      {activeSection === 'invite' && <InviteSection />}

                      {activeSection === 'blocked' && <BlockedSection />}

                      {activeSection === 'delete' && (
                        <DeleteSection
                          form={form}
                          handleChange={handleChange}
                          isFocused={isFocused}
                          setFocusedField={setFocusedField}
                        />
                      )}
                    </Stack>
                  )}
                  {/* GLOBAL SAVE / RESET - bara för vissa sektioner */}
                  {['profile', 'login', 'preferences'].includes(
                    activeSection,
                  ) && (
                    <Group justify='space-between'>
                      <>
                        <Button
                          onClick={handleResetChanges}
                          disabled={!hasChanged}
                          variant='light'>
                          Rensa ändringar
                        </Button>
                        <Button disabled={!hasChanged}>Spara</Button>
                      </>
                    </Group>
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
