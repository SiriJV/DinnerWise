import { Box, Divider, Stack, Text, UnstyledButton } from '@mantine/core';

interface MenuItemsProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function MenuItems({
  activeSection,
  setActiveSection,
}: MenuItemsProps) {
  const MenuItem = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: string;
    color?: string;
  }) => (
    <UnstyledButton
      onClick={() => setActiveSection(value)}
      px='sm'
      py='xs'
      bdrs='sm'
      c={color ? color : 'black'}
      style={{
        background:
          activeSection === value ? 'rgba(0,0,0,0.05)' : 'transparent',
      }}>
      <Text size='sm' fw={activeSection === value ? 600 : 400}>
        {label}
      </Text>
    </UnstyledButton>
  );
  return (
    <Box w='100%' maw={{ base: '100%', sm: 300 }}>
      <Stack gap='lg'>
        <Stack gap='xs'>
          <Text size='xs' fw={600} tt='uppercase'>
            Profil
          </Text>
          <MenuItem label='Profiluppgifter' value='profile' />
          <MenuItem label='Inloggning' value='login' />
          <MenuItem label='Behörigheter' value='permissions' />
        </Stack>

        <Stack gap='xs'>
          <Text size='xs' fw={600} tt='uppercase'>
            Preferenser
          </Text>
          <MenuItem label='Allmänt' value='preferences' />
          <MenuItem label='Aviseringar' value='notifications' />

          <MenuItem label='Bevakningar' value='watch' />
        </Stack>

        <Stack gap='xs'>
          <Text size='xs' fw={600} tt='uppercase'>
            Interaktion
          </Text>
          <MenuItem label='Bjud in vänner' value='invite' />
          <MenuItem label='Blockerade' value='blocked' />
        </Stack>

        <Divider />

        <MenuItem label='Radera konto' value='delete' color='red' />
      </Stack>
    </Box>
  );
}
