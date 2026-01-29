import { SimpleGrid, Tabs } from '@mantine/core';
import { useState } from 'react';
import EventCard from '../../components/EventCard/EventCard';

// type ProfilePageEventsProps = {
// eventId: number};

export default function ProfilePageEvents() {
  const [activeTab, setActiveTab] = useState<string | null>('first');

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value='first' color='black'>
          Mina event
        </Tabs.Tab>
        <Tabs.Tab value='second' color='black'>
          Sparade event
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='first'>
        <SimpleGrid
          cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
          spacing='md'
          mt='md'>
          <EventCard
            id={1}
            title='Zero Waste i vardagen'
            description='Den här träffen passar perfekt för dig som vill göra enkla val för en bättre miljö. Vi går igenom olika tips för att bli Zero Waste i vardagen och diskuterar nya trender inom hållbarhetstänk. Hoppas vi ses där!'
            current_participants={6}
            price={150}
            date={new Date('2026-01-19')}
            start_time='17:00:00'
            end_time='18:45:00'
            restaurant_id={1}
            restaurant_name='Noosh'
            restaurant_address='Österlånggatan 35, Borås'
          />
        </SimpleGrid>
      </Tabs.Panel>
      <Tabs.Panel value='second'>
        <SimpleGrid
          cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
          spacing='md'
          mt='md'>
          <EventCard
            id={2}
            title='Plocka svamp som ett proffs'
            description='Lär dig att hitta guldkornen i skogen och skilja på svamp och svamp med en riktig proffsplockare.'
            current_participants={3}
            price={99}
            date={new Date('2026-01-24')}
            start_time='18:00:00'
            end_time='20:00:00'
            restaurant_id={2}
            restaurant_name='Vinci'
            restaurant_address='Sandwalls Plats 7A, Borås'
          />
          <EventCard
            id={3}
            title='Heraldriska vapen och deras historia'
            description='Vi pratar svenska hiraldriska vapen och deras historia. När kom de till Sverige och hur användes de under århundradena?'
            current_participants={2}
            price={120}
            date={new Date('2026-02-04')}
            start_time='16:30:00'
            end_time='18:00:00'
            restaurant_id={3}
            restaurant_name='La Copita'
            restaurant_address='Allégatan 63, Borås'
          />
        </SimpleGrid>
      </Tabs.Panel>
    </Tabs>
  );
}
