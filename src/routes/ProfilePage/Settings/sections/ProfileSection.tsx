import {
  Avatar,
  Button,
  FileButton,
  Group,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';

interface ProfileSectionProps {
  form: {
    name: string;
    alias: string;
    bio: string;
    email: string;
    password: string;
    deletePassword: string;
    language: string;
    theme: string;
    timezone: string;
  };
  handleChange: (
    field: keyof ProfileSectionProps['form'],
    value: string,
  ) => void;
  isFocused: (field: string) => boolean;
  setFocusedField: (field: string | null) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  clearFile: () => void;
  user: any;
}

export default function ProfileSection({
  form,
  handleChange,
  isFocused,
  setFocusedField,
  file,
  setFile,
  clearFile,
  user,
}: ProfileSectionProps) {
  return (
    <>
      <Text size='sm' c='dimmed'>
        Hantera profilinställningar.
      </Text>
      <TextInput
        label='Namn'
        value={form.name}
        onChange={(e) => handleChange('name', e.currentTarget.value)}
        variant={isFocused('name') || form.name ? 'default' : 'filled'}
        onFocus={() => setFocusedField('name')}
        onBlur={() => setFocusedField(null)}
      />
      <TextInput
        label='Användarnamn'
        value={form.alias}
        onChange={(e) => handleChange('alias', e.currentTarget.value)}
        variant={isFocused('alias') || form.alias ? 'default' : 'filled'}
        onFocus={() => setFocusedField('alias')}
        onBlur={() => setFocusedField(null)}
      />
      <TextInput
        label='Beskrivning'
        value={form.bio}
        onChange={(e) => handleChange('bio', e.currentTarget.value)}
        variant={isFocused('bio') || form.bio ? 'default' : 'filled'}
        onFocus={() => setFocusedField('bio')}
        onBlur={() => setFocusedField(null)}
      />
      <Stack gap='xs'>
        <Group align='flex-end'>
          <FileButton onChange={setFile} accept='image/png,image/jpeg'>
            {(props) => (
              <Group align='flex-end'>
                <Avatar
                  size='lg'
                  component={UnstyledButton}
                  src={user?.profile_picture_url}
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
        {!file && <Text size='sm'>Godkända filformat: jpg, png</Text>}
        {file && <Text size='sm'>Vald fil: {file.name}</Text>}
      </Stack>
    </>
  );
}
