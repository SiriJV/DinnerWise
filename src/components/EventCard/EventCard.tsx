import { Card, Image, Text, Badge, Group } from '@mantine/core';

export default function EventCard() {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section>
        <Image
          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'
          height={160}
          alt='Norway'
          radius='md'
          fit='cover'
        />
      </Card.Section>

      <Group justify='space-between' mt='md' mb='xs'>
        <Text fw={500}>Norway Fjord Adventures</Text>
        <Badge color='pink'>On Sale</Badge>
      </Group>

      <Text size='sm' c='dimmed'>
        With Fjord Tours you can explore more of the magical fjord landscapes
        with tours and activities on and around the fjords of Norway
      </Text>
    </Card>
  );
}
