import {
  Box,
  Text,
  TextInput,
  Checkbox,
  Textarea,
  Grid,
  Stack,
} from '@mantine/core';
import { useState } from 'react';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import BaseModal from '../BaseModal/BaseModal';
import ModalEventInfo from '../ModalEventInfo/ModalEventInfo';
import type { EventType } from '../../../types/EventType';
import './RegisteringModal.scss';

interface RegisteringModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenPayment: () => void;
  event?: EventType | null;
}

export default function RegisteringModal({
  opened,
  onClose,
  onOpenPayment,
  event,
}: RegisteringModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (phone.startsWith('+46') || phone.startsWith('46')) {
      return digitsOnly.length === 11;
    }
    return digitsOnly.length === 10 && phone.startsWith('0');
  };

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    isValidPhone(phone) &&
    isValidEmail(email) &&
    termsAccepted;

  return (
    <BaseModal opened={opened} onClose={onClose} title='Anmälan'>
      {event && <ModalEventInfo event={event} showPrice />}

      <Box pt='md'>
        <Text size='lg' fw={600}>
          Deltagare
        </Text>

        <Grid gutter='md' pt='md'>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label='Förnamn'
              placeholder='Förnamn'
              required
              radius='xs'
              maxLength={40}
              value={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label='Efternamn'
              placeholder='Efternamn'
              required
              radius='xs'
              maxLength={40}
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
            />
          </Grid.Col>
        </Grid>

        <Grid gutter='md' pt='md'>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label='Telefon'
              placeholder='+46 70 123 45 67'
              required
              radius='xs'
              type='tel'
              maxLength={12}
              value={phone}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const formatted = value.replace(/[^\d+]/g, '');
                setPhone(formatted);
              }}
              error={
                phone && !isValidPhone(phone) ? 'Ogiltigt telefonnummer' : ''
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label='E-post'
              placeholder='exempel@email.com'
              required
              radius='xs'
              type='email'
              maxLength={40}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              error={
                email && !isValidEmail(email) ? 'Ogiltig e-postadress' : ''
              }
            />
          </Grid.Col>
        </Grid>

        <Textarea
          label='Meddelande (valfritt)'
          description='Max 300 tecken'
          placeholder='...'
          autosize
          minRows={2}
          maxRows={4}
          maxLength={300}
          radius='xs'
          pt='md'
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
        />

        <Stack mt='lg'>
          <Checkbox
            size='xs'
            checked={termsAccepted}
            required
            onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
            styles={{
              label: { display: 'flex', alignItems: 'center' },
            }}
            label={
              <>
                Jag har läst och godkänner anmälningsvillkoren.
                <span style={{ color: 'red' }}>*</span>
              </>
            }
          />
          <Checkbox
            size='xs'
            label='Jag vill gärna få nyhetsbrev och andra uppdateringar.'
            defaultChecked={true}
          />
        </Stack>
      </Box>
      <BaseButton
        variantType='primary'
        fullWidth
        mt='lg'
        disabled={!isFormValid}
        onClick={() => {
          onClose();
          onOpenPayment();
        }}>
        Till betalning
      </BaseButton>
    </BaseModal>
  );
}
