import {
  Box,
  Text,
  TextInput,
  Checkbox,
  Textarea,
  Grid,
  Stack,
  Button,
  Group,
} from '@mantine/core';
import { useState } from 'react';
import ModalEventInfo from '../../ModalEventInfo/ModalEventInfo';
import type { EventType } from '../../../../types/EventType';
import './RegisteringModal.scss';
import RegisteringBaseModal from '../../RegisteringBaseModal/RegisteringBaseModal';
import { generateEventSlug } from '../../../../utils/slugify';
import { validateEmail } from '../../../../utils/formValidation';
import { useFormTouched } from '../../../../hooks/useFormTouched';

interface Participant {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface RegisteringModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenPayment: () => void;
  onOpenWaitlist: () => void;
  event?: EventType | null;
  participant: Participant;
  setParticipant: (participant: Participant) => void;
  showBackButton?: boolean;
}

export default function RegisteringModal({
  opened,
  onClose,
  onOpenPayment,
  onOpenWaitlist,
  event,
  participant,
  setParticipant,
  showBackButton = true,
}: RegisteringModalProps) {
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { isTouched, handleBlur } = useFormTouched();
  const { isValid: isEmailValid, error: emailError } = validateEmail(
    participant.email,
  );

  const displayMaxSpots = event?.max_participants ?? 0;
  const isFull = event
    ? displayMaxSpots - (event.current_participants ?? 0) <= 0
    : false;

  const participantFullName = `${participant.firstName} ${participant.lastName}`;

  async function sendWaitlistEmails() {
    if (!event) return;

    // Send to host
    await fetch('http://localhost:3001/email/send-waitlist-email-to-host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: event.restaurant_name,
        date: event.date,
        startTime: event.start_time,
        event: event.title,
        path: `http://localhost:5173/event/${generateEventSlug(event.title, event.id)}`,
        name: participantFullName,
      }),
    });

    // Send to participant
    await fetch('http://localhost:3001/email/send-waitlist-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: event.restaurant_name,
        date: event.date,
        event: event.title,
        startTime: event.start_time,
        to: participant.email,
        path: `http://localhost:5173/event/${generateEventSlug(event.title, event.id)}`,
      }),
    });
  }

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
    participant.firstName.trim() !== '' &&
    participant.lastName.trim() !== '' &&
    isValidPhone(participant.phone) &&
    isEmailValid &&
    termsAccepted;

  return (
    <RegisteringBaseModal
      opened={opened}
      onClose={onClose}
      title='Anmälan'
      isFull={isFull}>
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          width: '100%',
          minWidth: 0,
          overflowX: 'hidden',
        }}>
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
                name='first-name'
                maxLength={40}
                value={participant.firstName}
                onChange={(e) =>
                  setParticipant({
                    ...participant,
                    firstName: e.currentTarget.value,
                  })
                }
                error={
                  participant.firstName === '' &&
                  (participant.lastName ||
                    participant.phone ||
                    participant.email)
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
                name='last-name'
                maxLength={40}
                value={participant.lastName}
                onChange={(e) =>
                  setParticipant({
                    ...participant,
                    lastName: e.currentTarget.value,
                  })
                }
                error={
                  participant.lastName === '' &&
                  (participant.firstName ||
                    participant.phone ||
                    participant.email)
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
                name='tel'
                maxLength={12}
                value={participant.phone}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  const formatted = value.replace(/[^\d+]/g, '');
                  setParticipant({
                    ...participant,
                    phone: formatted,
                  });
                }}
                error={
                  participant.phone && !isValidPhone(participant.phone)
                    ? 'Ogiltigt telefonnummer'
                    : ''
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label='E-post'
                placeholder='exempel@epost.se'
                required
                radius='xs'
                name='registration-email'
                maxLength={40}
                value={participant.email}
                onChange={(e) =>
                  setParticipant({
                    ...participant,
                    email: e.currentTarget.value,
                  })
                }
                onBlur={() => handleBlur('email')}
                error={
                  isTouched('email') && participant.email && !isEmailValid
                    ? emailError
                    : ''
                }
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label='Meddelande (valfritt)'
            description='Max 300 tecken'
            name='message'
            autoComplete='off'
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

          <Stack mt='lg' mb='lg'>
            <Checkbox
              size='xs'
              checked={termsAccepted}
              required
              name='terms-accepted'
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
              participant.firstName &&
              participant.lastName &&
              isValidPhone(participant.phone) &&
              isValidEmail(participant.email) && (
                <Text size='xs' c='red'>
                  Du måste godkänna anmälningsvillkoren för att fortsätta
                </Text>
              )}
            <Checkbox
              size='xs'
              label='Jag vill gärna få nyhetsbrev och andra uppdateringar.'
              name='newsletter-subscription'
              defaultChecked={true}
            />
          </Stack>
        </Box>
      </Box>
      <Box
        style={{
          flex: '0 0 auto',
          borderTop: '1px solid #e9ecef',
          paddingTop: '16px',
        }}>
        <Group gap='12px' justify='space-between'>
          {showBackButton && (
            <Button variant='default' disabled>
              Tillbaka
            </Button>
          )}
          {!showBackButton && <div />}
          <Group gap='12px'>
            <Button variant='default' onClick={onClose}>
              Avbryt
            </Button>
            <Button
              disabled={!isFormValid}
              onClick={() => {
                onClose();
                if (isFull) {
                  onOpenWaitlist();
                  sendWaitlistEmails();
                } else {
                  onOpenPayment();
                }
              }}>
              {isFull ? 'Ställ dig på väntelista' : 'Till betalning'}
            </Button>
          </Group>
        </Group>
      </Box>
    </RegisteringBaseModal>
  );
}
