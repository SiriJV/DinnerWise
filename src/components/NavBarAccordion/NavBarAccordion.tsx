import { Accordion, type AccordionControlProps } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import { accordionItems } from '../../data/NavLinks';
import { useEffect, useState } from 'react';
import './NavBarAccordion.scss';

interface NavBarAccordionProps {
  onClose?: () => void;
}

function AccordionControl(props: AccordionControlProps) {
  return <Accordion.Control {...props} />;
}

export default function NavBarAccordion({ onClose }: NavBarAccordionProps) {
  const location = useLocation();
  const [opened, setOpened] = useState<string[]>([]);

  useEffect(() => {
    const match = accordionItems.find((item) =>
      item.panels.some((panel) => panel.path === location.pathname)
    );

    if (match) {
      setOpened([match.value]);
    }
  }, [location.pathname]);

  return (
    <Accordion
      multiple
      value={opened}
      onChange={setOpened}
      chevronPosition='left'
      className='myAccordion'
      styles={{
        content: { padding: '4px 12px' },
        panel: { margin: 0 },
      }}>
      {accordionItems.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <AccordionControl>{item.label}</AccordionControl>

          {item.panels.map((panel, index) => (
            <NavLink
              key={panel.path}
              to={panel.path}
              onClick={onClose}
              className={({ isActive }) =>
                `accordionLink ${isActive ? 'active' : ''}`
              }>
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
