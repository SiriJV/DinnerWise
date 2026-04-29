import { PasswordInput, Text, TextInput } from '@mantine/core';
import { validateEmail } from '../../../../utils/formValidation';

interface LoginSectionProps {
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
  handleChange: (field: keyof LoginSectionProps['form'], value: string) => void;
  isFocused: (field: string) => boolean;
  setFocusedField: (field: string | null) => void;
}

export default function LoginSection({
  form,
  handleChange,
  isFocused,
  setFocusedField,
}: LoginSectionProps) {
  const { isValid: isEmailValid, error: emailError } = validateEmail(
    form.email,
  );
  return (
    <>
      <Text size='sm' c='dimmed'>
        Hantera inloggningsuppgifter.
      </Text>
      <TextInput
        label='E-post'
        value={form.email}
        onChange={(e) => handleChange('email', e.currentTarget.value)}
        variant={isFocused('email') || form.email ? 'default' : 'filled'}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
        error={form.email && !isEmailValid ? emailError : undefined}
      />
      <PasswordInput
        label='Lösenord'
        value={form.password}
        onChange={(e) => handleChange('password', e.currentTarget.value)}
        variant={isFocused('password') || form.password ? 'default' : 'filled'}
        onFocus={() => setFocusedField('password')}
        onBlur={() => setFocusedField(null)}
      />
    </>
  );
}
