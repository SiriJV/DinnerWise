import { ActionIcon, Group, Popover, Stack, Text } from '@mantine/core';
import {
  AlarmClock,
  BellIcon,
  CircleAlert,
  ClipboardList,
  Flame,
  Settings,
  UserRound,
  UtensilsCrossed,
} from 'lucide-react';
import NotificationsContent from './NotificationsContent';

export default function NotificationsPopup() {
  return (
    <Popover width={300} position='bottom' withArrow shadow='md'>
      <Popover.Target>
        <ActionIcon variant='subtle' color='white' size='md'>
          <BellIcon size={20} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Group justify='space-between' align='flex-end'>
            <Text size='md' fw={600}>
              Notiser
            </Text>
            <Settings size={20} />
          </Group>
          <Group justify='space-between' align='flex-end'>
            <Text size='sm' fw={600}>
              Idag
            </Text>
            <Text size='xs'>Rensa alla</Text>
          </Group>
          <Stack gap='md'>
            <NotificationsContent
              icon={CircleAlert}
              title='Ge feedback på event!'
              text='Eventet "Internet of Things" har nyligen avslutats - vi vill höra dina åsikter.'
              minutes={2}
              path='/event/internet-of-things-55/feedback'
            />
            <NotificationsContent
              icon={Flame}
              title='2 nya grammatik-event i ditt område!'
              text='Det har tillkommit två nya träffar kopplade till taggen "Grammatik".'
              minutes={10}
              path='/tagg/grammatik'
            />
            <NotificationsContent
              icon={UtensilsCrossed}
              title='Bokning bekräftad!'
              text='Ert bord för 8 personer är nu reserverat inför "Poesikväll".'
              minutes={27}
              path='/event/poesikvall-2'
            />
            <NotificationsContent
              icon={UserRound}
              title='Ny deltagare'
              text='Amanda L har anmält sig till "Datasäkerhet för alla".'
              hours={5}
              path='/event/datasakerhet-for-alla-17'
            />
          </Stack>
          <Text size='sm' fw={600} mt='md'>
            Senaste 30 dagarna
          </Text>{' '}
          <Stack gap='md' mb='xs'>
            <NotificationsContent
              icon={Flame}
              title='Populärt just nu!'
              text='"Konversation på tyska" har 2 platser kvar - säkra din plats nu.'
              date='igår'
              path='/event/konversation-pa-tyska-24'
            />
            <NotificationsContent
              icon={AlarmClock}
              title='Glöm inte dagens event!'
              text='Du är anmäld till "Studiecirkel - förstå EU-valet" som startar 16:30.'
              date='27 jan'
            />
            <NotificationsContent
              icon={ClipboardList}
              title='Eventinformation uppdaterad'
              text='Värden har justerat detaljer inför "Botanikworkshop".'
              date='19 jan'
            />
            <NotificationsContent
              icon={UserRound}
              title='Ny följare!'
              text='Carina S har börjat följa dig.'
              date='5 jan'
            />
          </Stack>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
