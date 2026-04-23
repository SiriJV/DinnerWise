import { Fragment, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Accordion,
  Stack,
  Group,
  Anchor,
} from '@mantine/core';
import { useModal } from '../../../contexts/ModalContext';
import { useAuth } from '../../../contexts/AuthContext';
import { slugify } from '../../../utils/slugify';
import { getFAQdata } from './FAQdata';
import DemoWarningText from '../../../components/common/DemoWarningText/DemoWarningText';

export default function FAQPage(): React.ReactNode {
  const { openCreate } = useModal();
  const { isLoggedIn } = useAuth();
  const FAQdata = getFAQdata(openCreate, isLoggedIn);

  // Gruppera FAQ efter kategori
  const categories = [...new Set(FAQdata.map((faq) => faq.category))];

  // En item öppen totalt - initieras med första frågan
  const [openItem, setOpenItem] = useState<string | null>(
    FAQdata[0]?.title ?? null,
  );

  const handleAccordionChange = (value: string | null) => {
    if (value !== null) {
      setOpenItem(value);
    }
  };

  return (
    <>
      <Container size='sm' pt='md' pb='xl'>
        <Title order={2} mb='md'>
          Vanliga frågor
        </Title>

        <Stack>
          <DemoWarningText text='Frågorna och svaren är endast exempel och kan komma att ändras.' />

          {/* Innehållsförteckning */}
          <Group gap='xs' mb='lg' wrap='wrap'>
            {categories.map((category, index) => (
              <Fragment key={category}>
                <Anchor
                  href={`#${slugify(category)}`}
                  size='sm'
                  c='dimmed'
                  underline='hover'>
                  {category}
                </Anchor>
                {index < categories.length - 1 && (
                  <Text size='sm' c='dimmed'>
                    •
                  </Text>
                )}
              </Fragment>
            ))}
          </Group>

          <Stack gap='xl'>
            {categories.map((category) => (
              <div
                key={category}
                id={slugify(category)}
                style={{ scrollMarginTop: '136px' }}>
                <Title order={4} mb='sm'>
                  {category}
                </Title>
                <Accordion
                  variant='default'
                  value={openItem}
                  onChange={handleAccordionChange}
                  styles={{
                    item: {
                      borderRadius: 'var(--mantine-radius-default)',
                      backgroundColor: 'var(--mantine-color-body)',
                      border: '1px solid var(--mantine-color-default-border)',
                      marginBottom: 'var(--mantine-spacing-sm)',
                    },
                  }}>
                  {FAQdata.filter((faq) => faq.category === category).map(
                    (faq) => (
                      <Accordion.Item value={faq.title} key={faq.title}>
                        <Accordion.Control>
                          <Text fw={600}>{faq.title}</Text>
                        </Accordion.Control>
                        <Accordion.Panel>{faq.content}</Accordion.Panel>
                      </Accordion.Item>
                    ),
                  )}
                </Accordion>
              </div>
            ))}
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
