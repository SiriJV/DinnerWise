import { Accordion, type AccordionControlProps } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { accordionItems } from '../../data/NavLinks';
import './NavBarAccordion.scss';

interface NavBarAccordionProps {
  onClose?: () => void;
}

function AccordionControl(props: AccordionControlProps) {
  return <Accordion.Control {...props} />;
}

export default function NavBarAccordion({ onClose }: NavBarAccordionProps) {
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
      {accordionItems.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <AccordionControl>{item.label}</AccordionControl>

          {item.panels.map((panel, index) => (
            <NavLink
              key={`/${panel.path}`}
              to={`${panel.path}`}
              className={({ isActive }) =>
                `accordionLink ${isActive ? 'active' : ''}`
              }
              onClick={onClose}>
              <Accordion.Panel
                className={
                  index === item.panels.length - 1 ? 'lastPanel' : undefined
                }>
                {panel.label}
              </Accordion.Panel>
            </NavLink>
          ))}
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
