import { Container, Title, Text, Accordion } from '@mantine/core';

const FAQdata = [
  {
    title: 'Hur fungerar DinnerWise?',
    content:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi culpa necessitatibus, temporibus, in at consequuntur maiores cum dignissimos laborum tempora magni eaque dolorem accusamus deserunt tenetur. Alias accusantium blanditiis tenetur.',
  },
  {
    title: 'Hur skapar jag ett konto?',
    content:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi culpa necessitatibus, temporibus, in at consequuntur maiores cum dignissimos laborum tempora magni eaque dolorem accusamus deserunt tenetur. Alias accusantium blanditiis tenetur.',
  },
  {
    title: 'Är det gratis att använda DinnerWise?',
    content:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi culpa necessitatibus, temporibus, in at consequuntur maiores cum dignissimos laborum tempora magni eaque dolorem accusamus deserunt tenetur. Alias accusantium blanditiis tenetur.',
  },
  {
    title: 'Hur anmäler jag mig till ett event?',
    content:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi culpa necessitatibus, temporibus, in at consequuntur maiores cum dignissimos laborum tempora magni eaque dolorem accusamus deserunt tenetur. Alias accusantium blanditiis tenetur.',
  },
  {
    title: 'Hur betalar jag för att gå med i event?',
    content:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi culpa necessitatibus, temporibus, in at consequuntur maiores cum dignissimos laborum tempora magni eaque dolorem accusamus deserunt tenetur. Alias accusantium blanditiis tenetur.',
  },
  {
    title: 'Hur skapar jag ett event?',
    content:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi culpa necessitatibus, temporibus, in at consequuntur maiores cum dignissimos laborum tempora magni eaque dolorem accusamus deserunt tenetur. Alias accusantium blanditiis tenetur.',
  },
];

export default function FAQPage(): React.ReactNode {
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          FAQ{' '}
        </Title>
        <Text>
          <Accordion variant='separated' defaultValue={FAQdata[0].title}>
            {FAQdata.map((faq) => (
              <Accordion.Item value={faq.title} key={faq.title}>
                <Accordion.Control>{faq.title}</Accordion.Control>
                <Accordion.Panel>{faq.content}</Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Text>
      </Container>
    </>
  );
}
