import { Container, Title, Text, Stack, Image, Grid } from '@mantine/core';

export default function AboutPage(): React.ReactNode {
  return (
    <>
      <Container size='lg'>
        <Title order={2} mb='md'>
          Om oss
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
            <Stack>
              <Text>
                DinnerWise är en plattform skapad för dig som vill upptäcka nya
                smaker, möta nya människor och dela inspirerande samtal över en
                god måltid. Vi tror att de bästa mötena sker runt matbordet -
                oavsett om du är ny i stan, vill bredda ditt nätverk eller bara
                är nyfiken på att träffa andra med liknande intressen.{' '}
              </Text>
              <Text>
                Hos oss kan du enkelt skapa eller delta i middagsevent med olika
                teman, på restauranger runt om i landet. Välj ett ämne du
                brinner för, eller låt dig överraskas av nya samtal och
                perspektiv. Vår vision är att göra det enkelt och tryggt att
                mötas och samtidigt ge restauranger möjlighet att fylla sina
                bord med glada gäster.
              </Text>
              <Text>
                Oavsett om du är värd eller deltagare vill vi att DinnerWise ska
                kännas välkomnande, inkluderande och inspirerande. Vi hoppas att
                du hittar både nya favoriträtter och nya vänner hos oss!
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
            <Image src='src/assets/4.jpg' alt='Om oss' radius='md' />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
