import { Text } from '@mantine/core';

export default function BlockedSection() {
  return (
    <>
      <Text size='sm' c='dimmed'>
        Användare du har blockerat.
      </Text>
      <Text>Du har inga blockerade användare.</Text>
    </>
  );
}
