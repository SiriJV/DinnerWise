import { Checkbox, Select, Stack, Text, TextInput } from '@mantine/core';

export default function PermissionsSection() {
  return (
    <>
      <Text size='sm' c='dimmed'>
        Hantera vem som kan se din profil och ditt innehåll.
      </Text>
      <Select
        label='Profilsynlighet'
        defaultValue='Offentlig'
        data={['Offentlig', 'Privat', 'Endast följare']}
      />
      <Select
        label='Visa e-post'
        defaultValue='Endast jag'
        data={['Offentlig', 'Endast jag']}
      />
      <TextInput
        label='Visa aktivitet'
        value='Följare'
        rightSection={<Checkbox defaultChecked />}
        readOnly
      />
      <Stack gap='xs'>
        <TextInput
          label='Visa event'
          value='Anmälda'
          rightSection={<Checkbox defaultChecked />}
          readOnly
        />
        <TextInput
          value='Bokmärkta'
          rightSection={<Checkbox defaultChecked />}
          readOnly
        />
        <TextInput
          value='Tidigare'
          rightSection={<Checkbox defaultChecked />}
          readOnly
        />
      </Stack>
    </>
  );
}
