import { Container, Title, Text, Stack, Grid } from '@mantine/core';
import { APP_CONFIG } from '../../config/appConfig';
import SkeletonImageComponent from '../../components/SkeletonImageComponent/SkeletonImageComponent';

export default function AboutPage(): React.ReactNode {
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Om oss
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }} order={{ base: 2, sm: 1 }}>
            <Stack>
              <Text>
                {APP_CONFIG.brandName} är en plattform skapad för dig som vill
                upptäcka nya smaker, möta nya människor och dela inspirerande
                samtal över en god måltid. Vi tror att de bästa mötena sker runt
                matbordet - oavsett om du är ny i stan, vill bredda ditt nätverk
                eller bara är nyfiken på att träffa andra med liknande
                intressen.{' '}
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
                Oavsett om du är värd eller deltagare vill vi att{' '}
                {APP_CONFIG.brandName} ska kännas välkomnande, inkluderande och
                inspirerande. Vi hoppas att du hittar både nya favoriträtter och
                nya vänner hos oss!
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }} order={{ base: 1, sm: 2 }}>
            <SkeletonImageComponent url={'src/assets/4.jpg'} alt={'Om oss'} />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
