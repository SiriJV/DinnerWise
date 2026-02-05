import {
  Box,
  Text,
  TextInput,
  Checkbox,
  Textarea,
  Grid,
  Stack,
  Flex,
  Group,
} from '@mantine/core';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import BaseModal from '../BaseModal/BaseModal';
import { Share } from 'lucide-react';

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenPayment: () => void;
}

export default function ConfirmationModal({
  opened,
  onClose,
  onOpenPayment,
}: ConfirmationModalProps) {
  return (
    <BaseModal
      opened={opened}
      onClose={onClose}
      title='Bekräftelse'
      onBack={() => {
        onClose();
        onOpenPayment();
      }}>
      <Group gap='sm' mb='md'>
        <Text size='lg'>
          Du är anmäld till{' '}
          <Text span fw={600}>
            Zero waste i vardagen
          </Text>{' '}
          med Anders Blom!
        </Text>
        <Text>
          Hej och välkommen! Jag heter Anders och är din värd. Under kvällen går
          vi tillsammans igenom enkla sätt att leva mer Zero Waste i vardagen, i
          en avslappnad miljö på Noosh. Jag ser fram emot att träffa dig och
          diskutera hållbara vanor som verkligen fungerar. Vi ses!
        </Text>
        <Text size='sm' fw={600}>
          Kvitto och bokningsdetaljer kommer på mejl.
        </Text>
      </Group>

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
          Kontaktuppgifter till värden{' '}
        </Text>

        <Grid gutter='md'>
          <Grid.Col span={6}>
            <TextInput
              label='Telefonnummer'
              value='+46703123456'
              variant='filled'
              readOnly
              radius='xs'
              mb='md'
              styles={{
                input: {
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  cursor: 'default',
                  pointerEvents: 'none',
                },
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label='E-post'
              value='anders.blom@email.se'
              variant='filled'
              readOnly
              radius='xs'
              mb='md'
              styles={{
                input: {
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  cursor: 'default',
                  pointerEvents: 'none',
                },
              }}
            />{' '}
          </Grid.Col>
        </Grid>
      </Box>
      <Group mt='lg' gap='md' align='stretch'>
        <Flex
          px='md'
          className='action-icon-button'
          align='center'
          justify='center'>
          <Share size={22} />
        </Flex>
        <BaseButton
          variantType='primary'
          style={{ flex: 1 }}
          onClick={() => {
            onClose();
          }}>
          Gå tillbaka till event{' '}
        </BaseButton>
      </Group>
    </BaseModal>
  );
}
