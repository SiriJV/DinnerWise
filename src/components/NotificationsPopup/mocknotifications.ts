import {
  CircleAlert,
  Flame,
  UtensilsCrossed,
  UserRound,
  AlarmClock,
  ClipboardList,
} from 'lucide-react';

export const mockNotifications = [
  {
    icon: CircleAlert,
    title: 'Ge feedback på event!',
    text: 'Eventet "Internet of Things" har nyligen avslutats - vi vill höra dina åsikter.',
    minutes: 2,
    path: '/event/internet-of-things-55/feedback',
  },
  {
    icon: Flame,
    title: '2 nya grammatik-event i ditt område!',
    text: 'Det har tillkommit två nya träffar kopplade till taggen "Grammatik".',
    minutes: 10,
    path: '/tagg/grammatik',
  },
  {
    icon: UtensilsCrossed,
    title: 'Bokning bekräftad!',
    text: 'Ert bord för 8 personer är nu reserverat inför "Poesikväll".',
    minutes: 27,
    path: '/event/poesikvall-2',
  },
  {
    icon: UserRound,
    title: 'Ny deltagare',
    text: 'Amanda L har anmält sig till "Datasäkerhet för alla".',
    hours: 5,
    path: '/event/datasakerhet-for-alla-17',
  },
  // Older
  {
    icon: Flame,
    title: 'Populärt just nu!',
    text: '"Konversation på tyska" har 2 platser kvar - säkra din plats nu.',
    date: 'igår',
    path: '/event/konversation-pa-tyska-24',
  },
  {
    icon: AlarmClock,
    title: 'Glöm inte dagens event!',
    text: 'Du är anmäld till "Studiecirkel - förstå EU-valet" som startar 16:30.',
    date: '27 jan',
  },
  {
    icon: ClipboardList,
    title: 'Eventinformation uppdaterad',
    text: 'Värden har justerat detaljer inför "Botanikworkshop".',
    date: '19 jan',
  },
];
