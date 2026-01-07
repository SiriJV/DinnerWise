import { Accordion, type AccordionControlProps, Center } from '@mantine/core';
import './NavBarAccordion.scss';

function AccordionControl(props: AccordionControlProps) {
  return <Accordion.Control {...props} />;
}

export default function NavBarAccordion() {
  return (
    <Accordion
      chevronPosition='left'
      multiple
      className='myAccordion'
      styles={{
        content: {
          padding: '4px 12px',
        },
        panel: {
          margin: 0,
        },
      }}>
      <Accordion.Item value='item-1'>
        <AccordionControl>DinnerWise</AccordionControl>
        <Accordion.Panel>Om oss</Accordion.Panel>
        <Accordion.Panel className='lastPanel'>Nyhetsbrev</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value='item-2'>
        <AccordionControl>Ditt konto</AccordionControl>
        <Accordion.Panel>Skapa konto</Accordion.Panel>
        <Accordion.Panel>Logga in</Accordion.Panel>
        <Accordion.Panel className='lastPanel'>Hjälp</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value='item-3'>
        <AccordionControl>Hjälp</AccordionControl>
        <Accordion.Panel>Betalning</Accordion.Panel>
        <Accordion.Panel>FAQ</Accordion.Panel>
        <Accordion.Panel>Köpvillkor</Accordion.Panel>
        <Accordion.Panel className='lastPanel'>
          Integritetspolicy
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value='item-4'>
        <AccordionControl>Kontakt</AccordionControl>
        <Accordion.Panel>Kundservice</Accordion.Panel>
        <Accordion.Panel className='lastPanel'>Kontakt</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value='item-5'>
        <AccordionControl>Följ oss</AccordionControl>
        <Accordion.Panel>Instagram</Accordion.Panel>
        <Accordion.Panel>Facebook</Accordion.Panel>
        <Accordion.Panel className='lastPanel'>X</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
