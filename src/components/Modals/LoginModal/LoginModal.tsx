import {
  Text,
  Modal,
  PasswordInput,
  TextInput,
  Anchor,
  Checkbox,
  Group,
} from '@mantine/core';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../../../contexts/ModalContext';
import { useState } from 'react';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function LoginModal({ opened, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { openCreate } = useModal();
  const [email, setEmail] = useState('anna.svensson@email.se');
  const [password, setPassword] = useState('lösenord123');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = password.trim() !== '' && isValidEmail(email);

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
        placeholder='exempel@email.com'
        required
        radius='xs'
        type='email'
        maxLength={40}
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        error={email && !isValidEmail(email) ? 'Ogiltig e-postadress' : ''}
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
      <Group justify='space-between' mt='lg'>
        <Checkbox label='Kom ihåg mig' />
        <Anchor component='button' size='sm'>
          Glömt lösenord?
        </Anchor>
      </Group>
      <BaseButton
        variantType='primary'
        fullWidth
        disabled={!isFormValid}
        onClick={() => {
          login();
          onClose();
        }}
        mt='lg'>
        Logga in
      </BaseButton>
    </Modal>
  );
}
