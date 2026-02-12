import {
  Anchor,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function CreateAccountPage() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Container size={420} my={40}>
      <Title ta='center'>Skapa konto</Title>

      <Text ta='center'>
        Redan medlem? <Anchor href='/logga-in'>Logga in</Anchor>
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
          onClick={login}
          to='/'
          mt='lg'>
          Skapa konto
        </BaseButton>
      </Paper>
    </Container>
  );
}
