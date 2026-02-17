import { Text, Modal, PasswordInput, TextInput, Anchor } from '@mantine/core';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../../../contexts/ModalContext';
import { useState } from 'react';

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
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        placeholder='exempel@email.com'
        required
        radius='xs'
        type='email'
        maxLength={40}
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        error={email && !isValidEmail(email) ? 'Ogiltig e-postadress' : ''}
      />
      <TextInput
        label='Bekräfta e-post'
        placeholder='exempel@email.com'
        required
        radius='xs'
        type='email'
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
        maxLength={40}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
        error={
          confirmPassword && !passwordsMatch ? 'Lösenorden matchar inte' : ''
        }
      />
      <BaseButton
        variantType='primary'
        fullWidth
        disabled={!isFormValid}
        onClick={() => {
          login();
          onClose();
        }}
        mt='lg'>
        Skapa konto
      </BaseButton>{' '}
    </Modal>
  );
}
