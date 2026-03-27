import {
  Container,
  Title,
  Text,
  Stepper,
  Stack,
  Grid,
  List,
  ThemeIcon,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import FloatingActionButton from '../../../components/FAB/FAB';
import './HowToPage.scss';
import { CircleCheckBig, OctagonX } from 'lucide-react';
import { APP_CONFIG } from '../../../config/appConfig';
import SkeletonImageComponent from '../../../components/SkeletonImageComponent/SkeletonImageComponent';

export default function HowToPage() {
  const [active, setActive] = useState(0);

  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    const handleScroll = () => {
      const middle = window.innerHeight * 0.4;

      let closestIndex = 0;
      let closestDistance = Infinity;

      stepRefs.forEach((ref, index) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const elementMiddle = rect.top + rect.height / 2;

        const distance = Math.abs(middle - elementMiddle);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActive(closestIndex + 1);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container size='lg' pt='md'>
      <FloatingActionButton />

      <Title order={2} mb='md'>
        Att tänka på när du skapar ett event
      </Title>

      <Stack gap='xl'>
        <Text>
          Att arrangera ett event är ett fantastiskt sätt att träffa nya
          människor, dela kunskap och skapa gemenskap. Tänk på att ditt event
          ska vara tillgängligt, roligt och tryggt för alla deltagare. Här får
          du några tips och riktlinjer för att lyckas!
        </Text>

        <Stack>
          <Title order={3}>Riktlinjer för värdar</Title>
          <List
            spacing='md'
            size='sm'
            center
            icon={
              <ThemeIcon size={24} radius='xl' color='darkgreen'>
                <CircleCheckBig size={16} />
              </ThemeIcon>
            }>
            <List.Item>
              Välj ett tydligt ämne eller aktivitet. Det kan vara allt från
              matlagning, språk, bokdiskussioner till hobbyprojekt. Tänk på att
              det ska vara något som lockar deltagarna och är roligt att
              utforska tillsammans.
            </List.Item>
            <List.Item>
              Var välkomnande och tydlig som värd. Hjälp deltagarna att känna
              sig inkluderade och trygga, särskilt i en liten grupp där alla kan
              bidra till samtalet.
            </List.Item>
            <List.Item>
              Se till att eventet är anpassat efter gruppen och lokalen. Mötet
              sker över en måltid, så tänk på att välja en restaurang eller
              lokal som passar för det antal deltagare du har och den typ av
              aktivitet ni ska göra.
            </List.Item>
            <List.Item>
              Uppmuntra positiv interaktion. Hjälp deltagarna att samarbeta,
              ställa frågor och dela sina erfarenheter utan press.
            </List.Item>
            <List.Item>
              Skicka eventuell förhandsinformation. Om deltagarna behöver ta med
              något eller förbereda sig på ett visst sätt, ge tydlig och vänlig
              instruktion innan eventet.
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon size={24} radius='xl'>
                  <OctagonX size={16} />
                </ThemeIcon>
              }
              c='red'>
              {APP_CONFIG.brandName} godkänner inte event som är av politisk,
              religiös eller kommersiell natur, eller som på annat sätt kan
              uppfattas som stötande eller olämpliga.
            </List.Item>
          </List>
        </Stack>

        <SkeletonImageComponent
          url='src/assets/2.jpg'
          alt='Hur det går till'
          maxHeight='350px'
        />
        <Stack>
          <Title order={3}>Hur går det till?</Title>

          <Grid gutter='md'>
            <Grid.Col span={4}>
              <Stepper
                active={active}
                onStepClick={(step) => {
                  setActive(step);
                  stepRefs[step].current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }}
                orientation='vertical'>
                <Stepper.Step
                  label='Steg 1'
                  description='Skapa konto'
                  className='howto-step'
                />
                <Stepper.Step
                  label='Steg 2'
                  description='Skapa event'
                  className='howto-step'
                />
                <Stepper.Step label='Steg 3' description='Publicera event' />
              </Stepper>
            </Grid.Col>

            <Grid.Col span={8}>
              <Stack h='100%' justify='space-between'>
                <Text ref={stepRefs[0]}>
                  Skapa eller logga in på ett konto. Det behövs för att du ska
                  kunna hantera dina event, kommunicera med deltagare och få
                  notifieringar om bokningar. Att ha ett konto gör också att
                  deltagarna kan känna sig trygga.
                </Text>

                <Text ref={stepRefs[1]} style={{ alignSelf: 'center' }}>
                  Skapa ditt event. Välj ett namn, beskrivning och antal
                  platser. Ange restaurang eller lokal, datum och tid. Glöm inte
                  att lägga till tydliga instruktioner för deltagarna om vad de
                  behöver ta med sig eller förbereda.
                </Text>

                <Text ref={stepRefs[2]}>
                  När eventet är klart att publiceras, dubbelkolla all
                  information. När det har godkänts av {APP_CONFIG.brandName}{' '}
                  och restaurangen har bekräftat bokningen blir det synligt för
                  deltagare. Tips: Dela eventet på sociala medier och i
                  relevanta grupper för att få fler deltagare.
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
}
