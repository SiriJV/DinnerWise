import { Accordion, type AccordionControlProps } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import { getAccordionItems } from '../../data/AccordionItems';
import { useEffect, useState } from 'react';
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
  const [opened, setOpened] = useState<string[]>([]);

  const accordionItems = getAccordionItems(isLoggedIn);

  useEffect(() => {
    // Sätt bara initialt öppnad sektion vid första render
    if (opened.length === 0) {
      const match = accordionItems.find((item) =>
        item.panels.some((panel) => panel.path === location.pathname),
      );
      if (match) {
        setOpened([match.value]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accordionItems]);

  return (
    <Accordion
      multiple
      value={opened}
      onChange={setOpened}
      chevronPosition='left'
      className='accordion'
      styles={{
        content: {
          paddingTop: 'var(--mantine-spacing-xs)',
          paddingBottom: 0,
        },
      }}>
      {accordionItems.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <AccordionControl>{item.label}</AccordionControl>

          {item.panels
            .filter((panel) => panel.element !== null || panel.modal)
            .map((panel, index) => {
              if (panel.modal === 'login') {
                return (
                  <button
                    key={panel.label}
                    className='accordionLink'
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      width: '100%',
                      textAlign: 'left',
                    }}
                    onClick={() => {
                      openLogin();
                      if (onClose) onClose();
                    }}>
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
              if (panel.modal === 'create') {
                return (
                  <button
                    key={panel.label}
                    className='accordionLink'
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      width: '100%',
                      textAlign: 'left',
                    }}
                    onClick={() => {
                      openCreate();
                      if (onClose) onClose();
                    }}>
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
              if (panel.modal === 'logout') {
                return (
                  <button
                    key={panel.label}
                    className='accordionLink'
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      width: '100%',
                      textAlign: 'left',
                    }}
                    onClick={() => {
                      logout();
                      if (onClose) onClose();
                    }}>
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
              );
            })}
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
