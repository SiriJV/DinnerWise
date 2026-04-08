import {
  Text,
  Modal,
  PasswordInput,
  TextInput,
  Anchor,
  Button,
} from '@mantine/core';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../../../contexts/ModalContext';
import { useState } from 'react';
import { APP_CONFIG } from '../../../config/appConfig';

interface CreateAccountModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateAccountModal({
  opened,
  onClose,
}: CreateAccountModalProps) {
  const { login } = useAuth();
  const { openLogin } = useModal();
  const [email, setEmail] = useState(APP_CONFIG.exampleUserEmail);
  const [confirmEmail, setConfirmEmail] = useState(APP_CONFIG.exampleUserEmail);
  const [password, setPassword] = useState('lösenord123');
  const [confirmPassword, setConfirmPassword] = useState('lösenord123');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const emailsMatch = email === confirmEmail;
  const passwordsMatch = password === confirmPassword;

  const isFormValid =
    password.trim() !== '' &&
    isValidEmail(email) &&
    emailsMatch &&
    passwordsMatch;

  async function sendWelcomeEmail() {
    await fetch('http://localhost:3001/email/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
      }),
    });
  }

  return (
    <Modal opened={opened} onClose={onClose} title='Skapa konto' centered>
      <Text ta='center'>
        Redan medlem?{' '}
        <Anchor
          component='button'
          onClick={() => {
            onClose();
            openLogin();
          }}>
          Logga in
        </Anchor>
      </Text>
      <TextInput
        label='E-post'
        placeholder='exempel@epost.se'
        required
        radius='xs'
        type='email'
        name='email'
        maxLength={40}
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        error={email && !isValidEmail(email) ? 'Ogiltig e-postadress' : ''}
      />
      <TextInput
        label='Bekräfta e-post'
        placeholder='exempel@epost.se'
        required
        radius='xs'
        type='email'
        name='email-confirm'
        maxLength={40}
        value={confirmEmail}
        onChange={(e) => setConfirmEmail(e.currentTarget.value)}
        error={confirmEmail && !emailsMatch ? 'E-post matchar inte' : ''}
      />
      <PasswordInput
        label='Lösenord'
        placeholder='Ditt lösenord'
        required
        mt='md'
        radius='xs'
        name='password'
        maxLength={40}
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        error={
          password === '' && email !== '' && password !== ''
            ? 'Lösenord krävs'
            : ''
        }
      />
      <PasswordInput
        label='Bekräfta lösenord'
        placeholder='Skriv lösenordet igen'
        required
        mt='md'
        radius='xs'
        name='password-confirm'
        maxLength={40}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
        error={
          confirmPassword && !passwordsMatch ? 'Lösenorden matchar inte' : ''
        }
      />
      <Button
        fullWidth
        disabled={!isFormValid}
        onClick={() => {
          login();
          onClose();
          sendWelcomeEmail();
        }}
        mt='lg'>
        Skapa konto
      </Button>{' '}
    </Modal>
  );
}
