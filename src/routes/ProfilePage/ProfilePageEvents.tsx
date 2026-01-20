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
            image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/cd/13/32/caption.jpg?w=1400&h=-1&s=1'
            host='Anders Blom'
            hostImage=''
            restaurant='Noosh'
            address='Österlånggatan 35, Borås'
            startTime={new Date('2026-01-19T17:00:00')}
            endTime={new Date('2026-01-19T18:45:00')}
            price={150}
            spots={6}
            maxSpots={6}
            description='Den här träffen passar perfekt för dig som vill göra enkla val för en bättre miljö. Vi går igenom olika tips för att bli Zero Waste i vardagen och diskuterar nya trender inom hållbarhetstänk. Hoppas vi ses där!'
          />
        </SimpleGrid>
      </Tabs.Panel>
      <Tabs.Panel value='second'>
        <SimpleGrid
          cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
          spacing='md'
          mt='md'>
          <EventCard
            id={1}
            title='Plocka svamp som ett proffs'
            image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/d1/5c/33/caption.jpg?w=1100&h=-1&s=1'
            host='Sara Flinck'
            hostImage=''
            restaurant='Vinci'
            address='Sandwalls Plats 7A, Borås'
            startTime={new Date('2026-01-24T18:00:00')}
            endTime={new Date('2026-01-24T20:00:00')}
            price={99}
            spots={3}
            maxSpots={5}
            description='Lär dig att hitta guldkornen i skogen och skilja på svamp och svamp med en riktig proffsplockare.'
          />
          <EventCard
            id={1}
            title='Heraldriska vapen och deras historia'
            image='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/91/05/5b/caption.jpg?w=1100&h=-1&s=1'
            host='Roger Göransson'
            hostImage=''
            restaurant='La Copita'
            address='Allégatan 63, Borås'
            startTime={new Date('2026-02-04T16:30:00')}
            endTime={new Date('2026-02-04T18:00:00')}
            price={120}
            spots={2}
            maxSpots={5}
            description='Vi pratar svenska hiraldriska vapen och deras historia. När kom de till Sverige och hur användes de under århundradena?'
          />
        </SimpleGrid>
      </Tabs.Panel>
    </Tabs>
  );
}
