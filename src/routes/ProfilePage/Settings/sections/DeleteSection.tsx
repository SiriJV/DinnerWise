import { Button, PasswordInput, Stack, Text } from '@mantine/core';

interface DeleteSectionProps {
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
    field: keyof DeleteSectionProps['form'],
    value: string,
  ) => void;
  isFocused: (field: string) => boolean;
  setFocusedField: (field: string | null) => void;
}

export default function DeleteSection({
  form,
  handleChange,
  isFocused,
  setFocusedField,
}: DeleteSectionProps) {
  return (
    <>
      <Stack>
        <Text size='sm' c='dimmed'>
          Radera konto permanent.{' '}
        </Text>
        <PasswordInput
          label='Skriv in ditt lösenord för att bekräfta'
          value={form.deletePassword}
          onChange={(e) =>
            handleChange('deletePassword', e.currentTarget.value)
          }
          variant={
            isFocused('deletePassword') || form.deletePassword
              ? 'default'
              : 'filled'
          }
          onFocus={() => setFocusedField('deletePassword')}
          onBlur={() => setFocusedField(null)}
        />
        <Button disabled={!form.deletePassword}>Radera konto</Button>
      </Stack>
      <Text c='red' size='sm'>
        OBS! Radering av ditt konto är permanent och kan inte ångras.
      </Text>
    </>
  );
}
