import {
  Text,
  Modal,
  Paper,
  PasswordInput,
  TextInput,
  Anchor,
} from '@mantine/core';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../../../contexts/ModalContext';

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

      <Paper withBorder shadow='sm' p={22} mt={30} radius='xs'>
        <TextInput
          label='E-post'
          placeholder='e-post@dinnerwise.se'
          required
          radius='xs'
        />
        <PasswordInput
          label='Lösenord'
          placeholder='Välj ett lösenord'
          required
          mt='md'
          radius='xs'
        />
        <PasswordInput
          label='Bekräfta lösenord'
          placeholder='Skriv lösenordet igen'
          required
          mt='md'
          radius='xs'
        />
        <BaseButton
          variantType='primary'
          fullWidth
          onClick={() => {
            login();
            onClose();
          }}
          mt='lg'>
          Skapa konto
        </BaseButton>{' '}
      </Paper>
    </Modal>
  );
}
