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
import BaseModal from '../BaseModal/BaseModal';
import swishLogo from '../../../assets/swish-logo.png';
import klarnaLogo from '../../../assets/klarna-logo.webp';
import './PaymentModal.scss';

interface PaymentModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenConfirmation: () => void;
  onOpenRegistration: () => void;
}

export default function PaymentModal({
  opened,
  onClose,
  onOpenConfirmation,
  onOpenRegistration,
}: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  return (
    <BaseModal
      opened={opened}
      onClose={onClose}
      title='Betalning'
      onBack={() => {
        onClose();
        onOpenRegistration();
      }}>
      {/* Eventinformation */}
      <Box bg='gray.2' p='md' bdrs='sm' mb='md'>
        <Text size='lg' fw={600} pb='xs'>
          Zero waste i vardagen
        </Text>
        <Text>
          <Text span fw={600}>
            Datum:{' '}
          </Text>
          2026-01-06
        </Text>
        <Text>
          <Text span fw={600}>
            Värd:{' '}
          </Text>
          Anders Blom
        </Text>
        <Text>
          <Text span fw={600}>
            Plats:{' '}
          </Text>
          Noosh, Österlånggatan 35, Borås
        </Text>
        <Text>
          <Text span fw={600}>
            Tid:{' '}
          </Text>
          17:00 - 18:45
        </Text>
      </Box>
      <Box>
        <Text size='lg' fw={600} mb='xs'>
          Att betala
        </Text>
        <TextInput
          // label='Att betala'
          value='Zero waste i vardagen'
          variant='filled'
          readOnly
          radius='xs'
          mb='md'
          rightSection={
            <Text fw={600} c='black'>
              150 kr
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
            <Group>
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
            <Group>
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
            <Group>
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
    </BaseModal>
  );
}
