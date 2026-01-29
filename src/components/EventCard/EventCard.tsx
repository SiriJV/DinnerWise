// import {
//   Card,
//   Image,
//   Text,
//   Badge,
//   Group,
//   Avatar,
//   Box,
//   Divider,
// } from '@mantine/core';
// import { BookmarkIcon } from 'lucide-react';
// import { useState } from 'react';
// import './EventCard.scss';
// import { NavLink } from 'react-router-dom';

// type EventCardProps = {
//   id: number;
//   title: string;
//   image: string;
//   host: string;
//   hostImage: string;
//   restaurant: string;
//   address: string;
//   startTime: Date;
//   endTime: Date;
//   price: number;
//   spots: number;
//   maxSpots: number;
//   description: string;
//   maxDescriptionLength?: number;
// };

// export default function EventCard({
//   id,
//   title,
//   image,
//   host,
//   hostImage,
//   restaurant,
//   address,
//   startTime,
//   endTime,
//   price,
//   spots,
//   maxSpots,
//   description,
//   maxDescriptionLength = 120,
// }: EventCardProps) {
//   const [isBookmarked, setIsBookmarked] = useState(false);

//   const remainingSpots = maxSpots - spots;
//   const isFull = remainingSpots <= 0;
//   const isAlmostFull = remainingSpots > 0 && remainingSpots <= 2;

//   const handleBookmarkClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsBookmarked(!isBookmarked);
//     // TODO: Här kan vi senare lägga till API-call för att spara till användarens bookmarklista
//     // await addToBookmarks(id);
//   };

//   const date = startTime.toLocaleDateString('sv-SE', {
//     weekday: 'short',
//     day: 'numeric',
//     month: 'short',
//   });

//   const start = startTime.toLocaleTimeString('sv-SE', {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   const end = endTime.toLocaleTimeString('sv-SE', {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   const timeRange = `${start}–${end}`;

//   const shortDescription =
//     description.length > maxDescriptionLength
//       ? description.slice(0, maxDescriptionLength).trim() + '…'
//       : description;

//   return (
//     <Card
//       className='eventCard'
//       component={NavLink}
//       to={`/event/${id}`}
//       shadow='sm'
//       radius='md'
//       pb='0'
//       withBorder>
//       <Card.Section pos='relative'>
//         <Image src={image} h={140} alt={title} fit='cover' />

//         <Box
//           className={`bookmarkButton ${isBookmarked ? 'bookmarked' : ''}`}
//           onClick={handleBookmarkClick}>
//           <BookmarkIcon
//             size={18}
//             color='black'
//             fill={isBookmarked ? 'black' : 'none'}
//           />
//         </Box>

//         <Avatar
//           src={hostImage}
//           alt={host}
//           radius='xl'
//           size={56}
//           className='hostAvatar'
//         />
//       </Card.Section>

//       <Box mt='xl' px='0' pb='xs'>
//         <Group justify='space-between'>
//           <Text fw={800}>{title}</Text>
//           {/* <Badge bg='rgba(206, 212, 218, 1)'> */}
//           <Text fw={600} c='black' className='price'>
//             {price} kr
//           </Text>
//           {/* </Badge> */}
//         </Group>

//         <Text size='sm' mb='xs'>
//           med {host}
//         </Text>

//         <Box className='eventInfo' mb='xs'>
//           <Text size='xs' c='dimmed' fw={600}>
//             <NavLink
//               to='/restaurang/:id'
//               className='unstyledNavLink'
//               onClick={(e) => e.stopPropagation()}>
//               {restaurant}
//             </NavLink>{' '}
//             · {address}
//           </Text>
//           {/* <Text size='xs' c='dimmed' className='separator'>
//             |
//           </Text> */}
//           <Divider orientation='vertical' size='sm' />

//           <Text size='xs' c='dimmed'>
//             {date} {timeRange}
//           </Text>
//         </Box>

//         <Text size='sm' c='dimmed' className='eventDescription'>
//           {shortDescription}
//         </Text>

//         <Badge
//           className='spotsBadge'
//           variant='filled'
//           style={{
//             backgroundColor: isFull
//               ? 'rgba(255, 204, 199, 1)'
//               : isAlmostFull
//               ? 'rgba(255, 238, 186, 1)'
//               : 'rgba(216, 227, 222, 1)',

//             color: isFull
//               ? 'rgba(116, 39, 62, 1)'
//               : isAlmostFull
//               ? 'rgba(120, 90, 10, 1)'
//               : 'rgba(36, 56, 33, 1)',
//           }}>
//           {isFull
//             ? 'Fullt'
//             : isAlmostFull
//             ? `${remainingSpots} av ${maxSpots} platser kvar`
//             : `${remainingSpots} av ${maxSpots} platser kvar`}
//         </Badge>
//       </Box>
//     </Card>
//   );
// }

import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Avatar,
  Box,
  Divider,
} from '@mantine/core';
import { BookmarkIcon } from 'lucide-react';
import { useState } from 'react';
import './EventCard.scss';
import { NavLink } from 'react-router-dom';

type EventCardProps = {
  id: number;
  title: string;
  description: string;
  current_participants: number;
  price: number;
  date: Date;
  start_time: string;
  end_time: string;
  maxDescriptionLength?: number;
};

export default function EventCard({
  id,
  title,
  description,
  current_participants,
  price,
  date,
  start_time,
  end_time,
  maxDescriptionLength = 120,
}: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Placeholder values - max_spots finns inte i API än
  const displayMaxSpots = 8;
  const displayCurrentParticipants =
    current_participants || Math.floor(Math.random() * 4) + 5;
  const displayPrice = typeof price === 'string' ? parseFloat(price) : price;

  const remainingSpots = displayMaxSpots - displayCurrentParticipants;
  const isFull = remainingSpots <= 0;
  const isAlmostFull = remainingSpots > 0 && remainingSpots <= 2;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // TODO: Lägg till API-call för bookmarks senare
  };

  const formattedDate = date.toLocaleDateString('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const start = start_time.slice(0, 5);
  const end = end_time.slice(0, 5);
  const timeRange = `${start}–${end}`;

  const shortDescription =
    description.length > maxDescriptionLength
      ? description.slice(0, maxDescriptionLength).trim() + '…'
      : description;

  return (
    <Card
      className='eventCard'
      component={NavLink}
      to={`/event/${id}`}
      shadow='sm'
      radius='md'
      pb='0'
      withBorder>
      <Card.Section pos='relative'>
        <Image
          src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop'
          h={140}
          alt={title}
          fit='cover'
        />

        <Box
          className={`bookmarkButton ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkClick}>
          <BookmarkIcon
            size={18}
            color='black'
            fill={isBookmarked ? 'black' : 'none'}
          />
        </Box>

        <Avatar
          src='https://images.unsplash.com/photo-1560250097-0b93528c311a'
          alt='Host'
          radius='xl'
          size={56}
          className='hostAvatar'
        />
      </Card.Section>

      <Box mt='xl' px='0' pb='xs'>
        <Group justify='space-between'>
          <Text fw={800}>{title}</Text>
          <Text fw={600} c='black' className='price'>
            {Math.floor(displayPrice)} kr
          </Text>
        </Group>

        <Text size='sm' mb='xs'>
          med Anders Blom
        </Text>

        <Box className='eventInfo' mb='xs'>
          <Text size='xs' c='dimmed' fw={600}>
            <NavLink
              to='/restaurang/:id'
              className='unstyledNavLink'
              onClick={(e) => e.stopPropagation()}>
              Noosh
            </NavLink>{' '}
            · Österlånggatan 35
          </Text>
          <Divider orientation='vertical' size='sm' />

          <Text size='xs' c='dimmed'>
            {formattedDate} {timeRange}
          </Text>
        </Box>

        <Text size='sm' c='dimmed' className='eventDescription'>
          {shortDescription}
        </Text>

        <Badge
          className='spotsBadge'
          variant='filled'
          style={{
            backgroundColor: isFull
              ? 'rgba(255, 204, 199, 1)'
              : isAlmostFull
                ? 'rgba(255, 238, 186, 1)'
                : 'rgba(216, 227, 222, 1)',

            color: isFull
              ? 'rgba(116, 39, 62, 1)'
              : isAlmostFull
                ? 'rgba(120, 90, 10, 1)'
                : 'rgba(36, 56, 33, 1)',
          }}>
          {isFull
            ? 'Fullt'
            : isAlmostFull
              ? `${remainingSpots} av ${displayMaxSpots} platser kvar`
              : `${remainingSpots} av ${displayMaxSpots} platser kvar`}
        </Badge>
      </Box>
    </Card>
  );
}
