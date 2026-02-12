import {
  Text,
  Modal,
  Paper,
  PasswordInput,
  TextInput,
  Anchor,
  Checkbox,
  Group,
  Title,
} from '@mantine/core';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import { useAuth } from '../../../contexts/AuthContext';
import { useModal } from '../../../contexts/ModalContext';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function LoginModal({ opened, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { openCreate } = useModal();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title ta='center'>Välkommen tillbaka</Title>}
      centered>
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
      <Paper withBorder shadow='sm' p={22} mt={30} radius='xs'>
        <TextInput
          label='E-post'
          placeholder='e-post@dinnerwise.se'
          required
          radius='xs'
        />
        <PasswordInput
          label='Lösenord'
          placeholder='Ditt lösenord'
          required
          mt='md'
          radius='xs'
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
          onClick={() => {
            login();
            onClose();
          }}
          mt='lg'>
          Logga in
        </BaseButton>
      </Paper>
    </Modal>
  );
}
