import { Accordion, Text, type AccordionControlProps } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import { getAccordionItems } from '../../data/AccordionItems';
import { useState } from 'react';
import './NavBarAccordion.scss';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';

interface NavBarAccordionProps {
  onClose?: () => void;
}

function AccordionControl(props: AccordionControlProps) {
  return <Accordion.Control {...props} />;
}

export default function NavBarAccordion({ onClose }: NavBarAccordionProps) {
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const { openLogin, openCreate } = useModal();
  const accordionItems = getAccordionItems(isLoggedIn);

  // Initialize opened state based on current location
  const initialOpened = (() => {
    const match = accordionItems.find((item) =>
      item.panels.some((panel) => panel.path === location.pathname),
    );
    return match ? [match.value] : [];
  })();

  const [opened, setOpened] = useState<string[]>(initialOpened);

  return (
    <>
      <Text fw={800} size='lg' pt='md'>
        Information och support
      </Text>
      <Accordion
        multiple
        value={opened}
        onChange={setOpened}
        chevronPosition='right'
        className='accordion'
        styles={{
          content: {
            paddingTop: 'var(--mantine-spacing-xs)',
            paddingBottom: 0,
          },
        }}>
        {accordionItems.map((item, itemIdx) => (
          <Accordion.Item
            key={item.value || item.label || itemIdx}
            value={item.value}>
            <AccordionControl className='accordionControl'>
              {item.label}
            </AccordionControl>

            {item.panels
              .filter((panel) => panel.element !== null || panel.modal)
              .map((panel, index) => {
                const uniqueKey = `${panel.label || ''}-${panel.path || ''}-${index}`;

                const handleClick = () => {
                  if (panel.modal === 'login') openLogin();
                  if (panel.modal === 'create') openCreate();
                  if (panel.modal === 'logout') logout();
                  if (onClose) onClose();
                };

                if (panel.modal) {
                  return (
                    <button
                      key={uniqueKey}
                      className='accordionLink'
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onClick={handleClick}>
                      <Accordion.Panel
                        className={
                          index === item.panels.length - 1
                            ? 'lastPanel'
                            : undefined
                        }>
                        {panel.label}
                      </Accordion.Panel>
                    </button>
                  );
                }

                return (
                  <NavLink
                    key={uniqueKey}
                    to={panel.path!}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `accordionLink ${isActive ? 'active' : ''}`
                    }>
                    <Accordion.Panel
                      className={
                        index === item.panels.length - 1
                          ? 'lastPanel'
                          : undefined
                      }>
                      {panel.label}
                    </Accordion.Panel>
                  </NavLink>
                );
              })}
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}
