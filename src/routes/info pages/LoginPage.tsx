import {
  Anchor,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';

export default function LoginPage() {
  return (
    <Container size={420} my={40}>
      <Title ta='center'>Välkommen tillbaka</Title>

      <Text ta='center'>
        Har du inget konto än? <Anchor href='/skapa-konto'>Skapa konto</Anchor>
      </Text>

      <Paper withBorder shadow='sm' p={22} mt={30} radius='xs'>
        <TextInput
          label='E-post'
          placeholder='mejl@dinnerwise.se'
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
        <BaseButton variantType='primary' fullWidth to='/' mt='lg'>
          Logga in
        </BaseButton>
      </Paper>
    </Container>
  );
}
