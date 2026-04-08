import {
  Text,
  Modal,
  PasswordInput,
  TextInput,
  Anchor,
  Checkbox,
  Group,
  Button,
} from '@mantine/core';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../../../contexts/ModalContext';
import { useState } from 'react';
import { APP_CONFIG } from '../../../config/appConfig';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function LoginModal({ opened, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { openCreate, executePendingAction } = useModal();
  const [email, setEmail] = useState(
    APP_CONFIG.exampleUserEmail || 'exempel@epost.se',
  );
  const [password, setPassword] = useState('lösenord123');

  // Track which fields have been touched/blurred
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = password.trim() !== '' && isValidEmail(email);

  const handleBlur = (field: keyof typeof touchedFields) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  return (
    <Modal opened={opened} onClose={onClose} title='Logga in' centered>
      <Text ta='center'>
        Har du inget konto än?{' '}
        <Anchor
          component='button'
          onClick={() => {
            onClose();
            openCreate();
          }}>
          Skapa konto
        </Anchor>
      </Text>
      <TextInput
        label='E-post'
        placeholder='exempel@epost.se'
        required
        radius='xs'
        type='email'
        name='email'
        autoComplete='email'
        maxLength={40}
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        onBlur={() => handleBlur('email')}
        error={
          touchedFields.email && email && !isValidEmail(email)
            ? 'Ogiltig e-postadress'
            : ''
        }
      />
      <PasswordInput
        label='Lösenord'
        placeholder='Ditt lösenord'
        required
        mt='md'
        radius='xs'
        name='password'
        autoComplete='current-password'
        maxLength={40}
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        onBlur={() => handleBlur('password')}
        error={
          touchedFields.password && password === '' ? 'Lösenord krävs' : ''
        }
      />
      <Group justify='space-between' mt='lg'>
        <Checkbox label='Kom ihåg mig' name='remember' />
        <Anchor component='button' size='sm'>
          Glömt lösenord?
        </Anchor>
      </Group>
      <Button
        fullWidth
        disabled={!isFormValid}
        onClick={() => {
          login();
          onClose();
          executePendingAction();
        }}
        mt='lg'>
        Logga in
      </Button>
    </Modal>
  );
}
