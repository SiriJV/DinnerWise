import { Container, Title, Text, Stack, Card, Group } from '@mantine/core';

export default function NewsletterPage(): React.ReactNode {
  return (
    <>
      <Container size='lg'>
        <Title order={2} mb='md'>
          Nyhetsbrev
        </Title>
        <Stack>
          <Card withBorder shadow='sm' radius='md' className='hover-style'>
            <Card.Section withBorder inheritPadding py='xs'>
              <Group justify='space-between'>
                <Text fw={600}>Nyhet 3</Text>
              </Group>
            </Card.Section>

            <Text mt='sm' c='dimmed' size='sm' lineClamp={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
              nulla dapibus nisi molestie vehicula. Aenean viverra mauris id
              diam convallis, et elementum quam aliquet. Curabitur molestie,
              elit ac maximus consequat, velit turpis gravida est, varius ornare
              ex turpis at magna. Morbi non erat venenatis, congue enim ut,
              ullamcorper nulla. Pellentesque et dignissim enim. Phasellus
              commodo efficitur lobortis. In id accumsan justo, at auctor
              libero. Nullam mattis lacus facilisis, gravida elit et, imperdiet
              mi. Duis id mattis massa. Vestibulum vel odio sit amet lorem porta
              pulvinar. Phasellus pharetra ac turpis a fringilla. Class aptent
              taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Pellentesque gravida ligula sit amet mi
              egestas, sit amet convallis ipsum suscipit. Maecenas vulputate
              magna faucibus lorem vehicula pretium.
            </Text>
          </Card>

          <Card withBorder shadow='sm' radius='md' className='hover-style'>
            <Card.Section withBorder inheritPadding py='xs'>
              <Group justify='space-between'>
                <Text fw={600}>Nyhet 2</Text>
              </Group>
            </Card.Section>

            <Text mt='sm' c='dimmed' size='sm' lineClamp={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
              nulla dapibus nisi molestie vehicula. Aenean viverra mauris id
              diam convallis, et elementum quam aliquet. Curabitur molestie,
              elit ac maximus consequat, velit turpis gravida est, varius ornare
              ex turpis at magna. Morbi non erat venenatis, congue enim ut,
              ullamcorper nulla. Pellentesque et dignissim enim. Phasellus
              commodo efficitur lobortis. In id accumsan justo, at auctor
              libero. Nullam mattis lacus facilisis, gravida elit et, imperdiet
              mi. Duis id mattis massa. Vestibulum vel odio sit amet lorem porta
              pulvinar. Phasellus pharetra ac turpis a fringilla. Class aptent
              taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Pellentesque gravida ligula sit amet mi
              egestas, sit amet convallis ipsum suscipit. Maecenas vulputate
              magna faucibus lorem vehicula pretium.
            </Text>
          </Card>

          <Card withBorder shadow='sm' radius='md' className='hover-style'>
            <Card.Section withBorder inheritPadding py='xs'>
              <Group justify='space-between'>
                <Text fw={600}>Nyhet 1</Text>
              </Group>
            </Card.Section>

            <Text mt='sm' c='dimmed' size='sm' lineClamp={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
              nulla dapibus nisi molestie vehicula. Aenean viverra mauris id
              diam convallis, et elementum quam aliquet. Curabitur molestie,
              elit ac maximus consequat, velit turpis gravida est, varius ornare
              ex turpis at magna. Morbi non erat venenatis, congue enim ut,
              ullamcorper nulla. Pellentesque et dignissim enim. Phasellus
              commodo efficitur lobortis. In id accumsan justo, at auctor
              libero. Nullam mattis lacus facilisis, gravida elit et, imperdiet
              mi. Duis id mattis massa. Vestibulum vel odio sit amet lorem porta
              pulvinar. Phasellus pharetra ac turpis a fringilla. Class aptent
              taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Pellentesque gravida ligula sit amet mi
              egestas, sit amet convallis ipsum suscipit. Maecenas vulputate
              magna faucibus lorem vehicula pretium.
            </Text>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
