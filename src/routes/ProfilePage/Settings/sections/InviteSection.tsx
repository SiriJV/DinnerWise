import { Button, Stack, Text, TextInput } from '@mantine/core';
import { APP_CONFIG } from '../../../../config/appConfig';
import { useState } from 'react';
import { validateEmail } from '../../../../utils/formValidation';

export default function InviteSection() {
  const [email, setEmail] = useState('');
  const { isValid: isEmailValid, error: emailError } = validateEmail(email);
  return (
    <Stack maw={400}>
      <Text size='sm' c='dimmed'>
        Bjud in vänner till plattformen.
      </Text>
      <TextInput
        label='E-postadress'
        placeholder={APP_CONFIG.exampleEmail}
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        error={email && !isEmailValid ? emailError : undefined}
      />
      <Button variant='light' disabled={!isEmailValid}>
        Skicka inbjudan
      </Button>
    </Stack>
  );
}
