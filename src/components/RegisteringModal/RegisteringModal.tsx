import {
  Box,
  Text,
  Modal,
  TextInput,
  Group,
  Checkbox,
  ActionIcon,
  Textarea,
  Grid,
  Stack,
} from '@mantine/core';
import { CircleHelp } from 'lucide-react';
import BaseButton from '../Buttons/BaseButton/BaseButton';
import './RegisteringModal.scss';

interface RegisteringModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function RegisteringModal({
  opened,
  onClose,
}: RegisteringModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap='md' wrap='nowrap' className='modal-title-group'>
          <Text fw={600}>Anmälan</Text>
          <ActionIcon
            variant='subtle'
            color='red'
            size='md'
            radius='sm'
            className='modal-help-icon'>
            <CircleHelp size={20} />
          </ActionIcon>
        </Group>
      }
      centered
      styles={{
        header: {
          display: 'flex',
          alignItems: 'center',
        },
        title: {
          flex: 1,
          display: 'flex',
        },
      }}>
      <Box bg='gray'>
        <Text>Zero waste i vardagen</Text>
        <Text>Datum: 2026-01-06</Text>
        <Text>Ledare: Anders Blom</Text>
        <Text>Plats: Noosh, Österlånggatan 35, Borås</Text>
        <Text>Tid: 17:00 - 18:45</Text>
        <Text>Kostnad: 150 kr</Text>
      </Box>
      {/* <Container size={420} my={40}> */}
      <Text>Deltagare</Text>

      {/* <Paper withBorder shadow='sm' p={22} mt={30} radius='xs'> */}
      <Grid gutter='md' pt='md'>
        <Grid.Col span={6}>
          <TextInput
            label='Förnamn'
            placeholder='Förnamn'
            required
            radius='xs'
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label='Efternamn'
            placeholder='Efternamn'
            required
            radius='xs'
          />
        </Grid.Col>
      </Grid>

      <Grid gutter='md' pt='md'>
        <Grid.Col span={6}>
          <TextInput
            label='Telefon'
            placeholder='+46703123456'
            required
            radius='xs'
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label='E-post'
            placeholder='Efternamn'
            required
            radius='xs'
          />
        </Grid.Col>
      </Grid>

      <Textarea
        label='Meddelande (frivilligt)'
        placeholder='...'
        required
        radius='xs'
        pt='md'
      />

      <Stack mt='lg'>
        <Checkbox
          size='xs'
          label='Jag har läst och godkänner anmälningsvillkoren.'
        />
        <Checkbox
          size='xs'
          label='Jag vill gärna få nyhetsbrev och andra uppdateringar.'
          checked={true}
        />
      </Stack>
      <BaseButton variantType='primary' fullWidth to='/' mt='lg'>
        Till betalning
      </BaseButton>
      {/* </Paper> */}
      {/* </Container> */}
    </Modal>
  );
}
