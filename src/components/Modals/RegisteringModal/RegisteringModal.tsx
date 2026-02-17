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
import ModalEventInfo from '../ModalEventInfo/ModalEventInfo';
import type { EventType } from '../../../types/EventType';
import './RegisteringModal.scss';
import RegisteringBaseModal from '../RegisteringBaseModal/RegisteringBaseModal';

interface RegisteringModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenPayment: () => void;
  onOpenWaitlist: () => void;
  event?: EventType | null;
}

export default function RegisteringModal({
  opened,
  onClose,
  onOpenPayment,
  onOpenWaitlist,
  event,
}: RegisteringModalProps) {
  const [firstName, setFirstName] = useState('Anna');
  const [lastName, setLastName] = useState('Svensson');
  const [phone, setPhone] = useState('+46701234567');
  const [email, setEmail] = useState('anna.svensson@email.se');
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const displayMaxSpots = event?.max_participants ?? 0;
  const isFull = event
    ? displayMaxSpots - (event.current_participants ?? 0) <= 0
    : false;

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
    <RegisteringBaseModal opened={opened} onClose={onClose} title='Anmälan' isFull={isFull}>
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
              error={
                firstName === '' && (lastName || phone || email)
                  ? 'Förnamn krävs'
                  : ''
              }
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
              error={
                lastName === '' && (firstName || phone || email)
                  ? 'Efternamn krävs'
                  : ''
              }
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
          {!termsAccepted &&
            firstName &&
            lastName &&
            isValidPhone(phone) &&
            isValidEmail(email) && (
              <Text size='xs' c='red'>
                Du måste godkänna anmälningsvillkoren för att fortsätta
              </Text>
            )}
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
          if (isFull) {
            onOpenWaitlist();
          } else {
            onOpenPayment();
          }
        }}>
        {isFull ? 'Ställ dig på väntelista' : 'Till betalning'}
      </BaseButton>
    </RegisteringBaseModal>
  );
}
