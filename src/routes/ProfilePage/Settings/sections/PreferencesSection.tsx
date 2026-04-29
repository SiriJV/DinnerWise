import { Select, Text } from '@mantine/core';

interface PreferencesSectionProps {
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
    field: 'language' | 'theme' | 'timezone',
    value: string,
  ) => void;
}

export default function PreferencesSection({
  form,
  handleChange,
}: PreferencesSectionProps) {
  return (
    <>
      <Text size='sm' c='dimmed'>
        Anpassa hur appen beter sig för dig.
      </Text>
      <Select
        label='Språk'
        value={form.language}
        onChange={(val) => handleChange('language', val || 'Svenska')}
        data={['Svenska', 'Engelska']}
      />
      <Select
        label='Tema'
        value={form.theme}
        onChange={(val) => handleChange('theme', val || 'Ljust')}
        data={['Ljust', 'Mörkt']}
      />
      <Select
        label='Tidszon'
        value={form.timezone}
        onChange={(val) => handleChange('timezone', val || 'Europe/Stockholm')}
        data={['Europe/Stockholm']}
      />
    </>
  );
}
