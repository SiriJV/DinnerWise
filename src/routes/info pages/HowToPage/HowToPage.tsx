import { Container, Title, Text, Stepper, Stack, Grid } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import FloatingActionButton from '../../../components/FAB/FAB';
import './HowToPage.scss';

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
    <>
      <Container size='lg'>
        <FloatingActionButton />

        <Title order={2} mb='md'>
          Att tänka på när du skapar ett event
        </Title>
        <Stack>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed
            nulla dapibus nisi molestie vehicula. Aenean viverra mauris id diam
            convallis, et elementum quam aliquet. Curabitur molestie, elit ac
            maximus consequat, velit turpis gravida est, varius ornare ex turpis
            at magna. Morbi non erat venenatis, congue enim ut, ullamcorper
            nulla. Pellentesque et dignissim enim. Phasellus commodo efficitur
            lobortis. In id accumsan justo, at auctor libero. Nullam mattis
            lacus facilisis, gravida elit et, imperdiet mi. Duis id mattis
            massa. Vestibulum vel odio sit amet lorem porta pulvinar. Phasellus
            pharetra ac turpis a fringilla. Class aptent taciti sociosqu ad
            litora torquent per conubia nostra, per inceptos himenaeos.
            Pellentesque gravida ligula sit amet mi egestas, sit amet convallis
            ipsum suscipit. Maecenas vulputate magna faucibus lorem vehicula
            pretium.
          </Text>
          <Stack>
            <Title order={3}>Riktlinjer</Title>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus libero alias, recusandae amet laudantium non
              doloremque sequi veniam impedit obcaecati, quidem repellendus
              vitae molestias. Veniam quaerat perferendis architecto illo
              similique.
            </Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus libero alias, recusandae amet laudantium non
              doloremque sequi veniam impedit obcaecati, quidem repellendus
              vitae molestias. Veniam quaerat perferendis architecto illo
              similique.
            </Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus libero alias, recusandae amet laudantium non
              doloremque sequi veniam impedit obcaecati, quidem repellendus
              vitae molestias. Veniam quaerat perferendis architecto illo
              similique.
            </Text>
          </Stack>
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
                    Skapa eller logga in på ett konto. För att kunna skapa ett
                    event behöver du vara inloggad. Detta är för att säkerställa
                    att du är den du säger dig vara och för att kunna hantera
                    dina event och bokningar på ett smidigt och säkert sätt.
                  </Text>
                  <Text ref={stepRefs[1]} style={{ alignSelf: 'center' }}>
                    Skapa eventet. Tryck på plustecknet i översta högra hörnet
                    på sidan eller på den flytande plusknappen i nedre högra
                    hörnet. Följ instruktionerna, fyll i dina uppgifter och
                    skapa eventet. Nu är det bara att vänta!
                  </Text>
                  <Text ref={stepRefs[2]}>
                    Eventet publiceras när det har godkänts av DinnerWise och
                    när restaurangen har accepterat bokningen. Då kan du se ditt
                    event på sidan och andra användare kan anmäla sig till det.
                    Tips är att dela ditt event på sociala medier för att få
                    fler deltagare.
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
