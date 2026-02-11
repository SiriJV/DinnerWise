import { ActionIcon, Group, Popover, Stack, Text } from '@mantine/core';
import {
  AlarmClock,
  BellIcon,
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
              icon={Flame}
              title='2 nya franska-event i ditt område!'
              text='Det har tillkommit två nya träffar kopplade till taggen "Franska".'
              minutes={10}
            />
            <NotificationsContent
              icon={UtensilsCrossed}
              title='Bokning bekräftad!'
              text='Ert bord för 8 personer är nu reserverat inför "Poesikväll".'
              minutes={27}
            />
            <NotificationsContent
              icon={UserRound}
              title='Ny deltagare'
              text='Amanda L har anmält sig till "Datasäkerhet för alla".'
              hours={5}
            />
          </Stack>
          <Text size='sm' fw={600} mt='md'>
            Senaste 30 dagarna
          </Text>{' '}
          <Stack gap='md'>
            <NotificationsContent
              icon={Flame}
              title='Populärt just nu!'
              text='"Konversation i lätt svenska" har 2 platser kvar - säkra din plats nu.'
              date='igår'
            />
            <NotificationsContent
              icon={AlarmClock}
              title='Glöm inte dagens event!'
              text='"Studiecirkel - förstå EU-valet" startar 16:30.'
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
