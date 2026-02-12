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
} from '@mantine/core';
import { CreditCard } from 'lucide-react';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import ModalEventInfo from '../ModalEventInfo/ModalEventInfo';
import swishLogo from '../../../assets/swish-logo.png';
import klarnaLogo from '../../../assets/klarna-logo.webp';
import type { EventType } from '../../../types/EventType';
import './PaymentModal.scss';
import RegisteringBaseModal from '../RegisteringBaseModal/RegisteringBaseModal';

interface PaymentModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenConfirmation: () => void;
  onOpenRegistration: () => void;
  event?: EventType | null;
}

export default function PaymentModal({
  opened,
  onClose,
  onOpenConfirmation,
  onOpenRegistration,
  event,
}: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  return (
    <RegisteringBaseModal
      opened={opened}
      onClose={onClose}
      title='Betalning'
      onBack={() => {
        onClose();
        onOpenRegistration();
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
              Förnamn Efternamn
            </Text>
          </Text>
          <Text size='sm'>
            <Text span fw={600}>
              Telefon:{' '}
            </Text>
            +46703123456
          </Text>
          <Text size='sm'>
            <Text span fw={600}>
              E-post:{' '}
            </Text>
            exempel@email.com
          </Text>
        </Box>
      </Box>

      <Divider my='lg' />

      <Box>
        <Group justify='space-between' align='center' mb='md'>
          <Text size='lg' fw={600}>
            Betalningsalternativ
          </Text>
          <TextInput placeholder='Lägg till kampanjkod' radius='xs' />
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
          Totalbelopp: 150 kr
        </Text>
        <Text mt='xs' size='xs'>
          Genom att slutföra köpet godkänner du våra köpvillkor och bekräftar
          att du tagit del av informationen om betalning, leverans och
          ångerrätt.
        </Text>
      </Box>

      <BaseButton
        variantType='primary'
        fullWidth
        mt='lg'
        disabled={!selectedPayment}
        onClick={() => {
          onClose();
          onOpenConfirmation();
        }}>
        Slutför betalning
      </BaseButton>
    </RegisteringBaseModal>
  );
}
