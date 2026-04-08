import { useState } from 'react';
import {
  Box,
  Text,
  TextInput,
  Anchor,
  Divider,
  Group,
  Stack,
  Image,
  Button,
} from '@mantine/core';
import { CreditCard } from 'lucide-react';
import swishLogo from '../../../../assets/swish-logo.png';
import klarnaLogo from '../../../../assets/klarna-logo.webp';
import type { EventType } from '../../../../types/EventType';
import './PaymentModal.scss';
import RegisteringBaseModal from '../../RegisteringBaseModal/RegisteringBaseModal';
import { generateEventSlug } from '../../../../utils/slugify';
import ModalEventInfo from '../../ModalEventInfo/ModalEventInfo';

interface Participant {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface PaymentModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenConfirmation: () => void;
  onOpenRegistration: () => void;
  event?: EventType | null;
  participant: Participant;
  showBackButton?: boolean;
}

export default function PaymentModal({
  opened,
  onClose,
  onOpenConfirmation,
  onOpenRegistration,
  event,
  participant,
  showBackButton = true,
}: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  async function sendBookingEmails() {
    if (!event) return;
    // Send to host
    await fetch('http://localhost:3001/email/send-booking-email-to-host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: event.restaurant_name,
        date: event.date,
        startTime: event.start_time,
        event: event.title,
        path: `http://localhost:5173/event/${generateEventSlug(event.title, event.id)}`,
        name: `${participant.firstName} ${participant.lastName}`,
      }),
    });

    // Send to participant
    await fetch('http://localhost:3001/email/send-booking-email', {
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

  return (
    <RegisteringBaseModal opened={opened} onClose={onClose} title='Betalning'>
      <Box
        mb='lg'
        style={{
          flex: 1,
          overflowY: 'auto',
          width: '100%',
          minWidth: 0,
          overflowX: 'hidden',
        }}>
        {/* Eventinformation */}
        {event && (
          <Box mb='md'>
            <ModalEventInfo event={event} showPrice={false} />
          </Box>
        )}
        <Box>
          <Text size='lg' fw={600} mb='xs'>
            Att betala
          </Text>
          <TextInput
            value={event?.title || ''}
            variant='filled'
            readOnly
            radius='xs'
            mb='md'
            rightSection={
              <Text fw={600} c='black'>
                {event ? Math.floor(event.price) : 0} kr
              </Text>
            }
            rightSectionWidth={80}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-gray-0)',
                cursor: 'default',
                pointerEvents: 'none',
              },
            }}
          />
        </Box>

        <Box mb='md'>
          <Group justify='space-between' mb='xs' align='flex-end'>
            <Text size='lg' fw={600}>
              Deltagare
            </Text>
            <Anchor
              size='sm'
              onClick={() => {
                onClose();
                onOpenRegistration();
              }}
              style={{ cursor: 'pointer' }}>
              Ändra uppgifter
            </Anchor>
          </Group>
          <Box bg='gray.0' p='md' bdrs='sm'>
            <Text size='sm'>
              <Text span fw={600}>
                {participant.firstName} {participant.lastName}
              </Text>
            </Text>
            <Text size='sm'>
              <Text span fw={600}>
                Telefon:{' '}
              </Text>
              {participant.phone || ''}
            </Text>
            <Text size='sm'>
              <Text span fw={600}>
                E-post:{' '}
              </Text>
              {participant.email}
            </Text>
          </Box>
        </Box>

        <Divider my='lg' />

        <Box>
          <Group justify='space-between' align='center' mb='md'>
            <Text size='lg' fw={600}>
              Betalningsalternativ
            </Text>
            <TextInput
              placeholder='Kampanjkod'
              radius='xs'
              name='promo-code'
              style={{ maxWidth: '150px' }}
            />
          </Group>

          <Text size='sm'>Välj betalsätt</Text>
          <Stack gap={0} mt='xs'>
            <Box
              className={`payment-options-box ${
                selectedPayment === 'swish' ? 'active' : ''
              }`}
              onClick={() => setSelectedPayment('swish')}>
              <Group wrap='nowrap'>
                <Image
                  src={swishLogo}
                  alt='Swish'
                  w={50}
                  h={50}
                  style={{
                    aspectRatio: '1/1',
                    objectFit: 'contain',
                  }}
                />
                <Stack gap='0'>
                  <Text fw={600}>Swish</Text>
                  <Text size='sm'>Direkt i mobilen med mobilt BankID</Text>
                </Stack>
              </Group>
            </Box>
            <Box
              className={`payment-options-box ${
                selectedPayment === 'card' ? 'active' : ''
              }`}
              onClick={() => setSelectedPayment('card')}>
              <Group wrap='nowrap'>
                <Box
                  w={50}
                  h={50}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <CreditCard size={32} strokeWidth={1.5} />
                </Box>
                <Stack gap='0'>
                  <Text fw={600}>Kort</Text>
                  <Text size='sm'>Visa & Mastercard</Text>
                </Stack>
              </Group>
            </Box>
            <Box
              className={`payment-options-box ${
                selectedPayment === 'klarna' ? 'active' : ''
              }`}
              onClick={() => setSelectedPayment('klarna')}>
              <Group wrap='nowrap'>
                <Image
                  src={klarnaLogo}
                  alt='Klarna'
                  w={50}
                  h={50}
                  style={{
                    aspectRatio: '1/1',
                    objectFit: 'contain',
                  }}
                />
                <Stack gap='0'>
                  <Text fw={600}>Klarna</Text>
                  <Text size='sm'>Köp nu - betala sen</Text>
                </Stack>
              </Group>
            </Box>
          </Stack>
          <Text size='lg' fw={600} mt='md'>
            Totalbelopp: {event ? Math.floor(event.price) : 0} kr
          </Text>
          <Text mt='xs' size='xs'>
            Genom att slutföra köpet godkänner du våra köpvillkor och bekräftar
            att du tagit del av informationen om betalning, leverans och
            ångerrätt.
          </Text>
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
            <Button
              variant='default'
              onClick={() => {
                onClose();
                onOpenRegistration();
              }}>
              Tillbaka
            </Button>
          )}
          {!showBackButton && <div />}
          <Group gap='12px'>
            <Button variant='default' onClick={onClose}>
              Avbryt
            </Button>
            <Button
              disabled={!selectedPayment}
              onClick={async () => {
                await sendBookingEmails();
                onClose();
                onOpenConfirmation();
              }}>
              Slutför betalning
            </Button>
          </Group>
        </Group>
      </Box>
    </RegisteringBaseModal>
  );
}
