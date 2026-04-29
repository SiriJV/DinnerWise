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
import { validateEmail, validatePassword } from '../../../utils/formValidation';
import { useFormTouched } from '../../../hooks/useFormTouched';

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

  const { isTouched, handleBlur } = useFormTouched();
  const { isValid: isEmailValid, error: emailError } = validateEmail(email);
  const { isValid: isPasswordValid, error: passwordError } =
    validatePassword(password);

  const isFormValid = isPasswordValid && isEmailValid;

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
        error={isTouched('email') && email && !isEmailValid ? emailError : ''}
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
          isTouched('password') && password && !isPasswordValid
            ? passwordError
            : ''
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
