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

export default function CreateAccountPage() {
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
        <BaseButton variantType='primary' fullWidth to='/' mt='lg'>
          Skapa konto
        </BaseButton>
      </Paper>
    </Container>
  );
}
