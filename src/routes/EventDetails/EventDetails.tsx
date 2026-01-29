import {
  Text,
  Image,
  Grid,
  Stack,
  Box,
  Group,
  Badge,
  Flex,
} from '@mantine/core';
import './EventDetails.scss';
import {
  BookmarkIcon,
  ChevronRight,
  FlagIcon,
  MapPin,
  Share,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BaseButton from '../../components/Buttons/BaseButton/BaseButton';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

export default function EventDetails(): React.ReactNode {
  return (
    <>
      <Breadcrumb />
      <Grid m='md' gutter='xl' mx='md'>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap={0} mb='lg'>
            <Group justify='space-between'>
              <Text size='xl' fw={800}>
                Zero Waste i vardagen
              </Text>
              <Badge
                bg='rgba(255, 204, 199, 1)'
                c='rgba(116, 39, 62, 1)'
                size='lg'>
                Fullt
              </Badge>
            </Group>
            <Text component={NavLink} to='/profil/:id'>
              med Anders Blom
            </Text>
          </Stack>
          <Text>
            Den här träffen passar perfekt för dig som vill göra enkla val för
            en bättre miljö. Vi går igenom olika tips för att bli Zero Waste i
            vardagen och diskuterar nya trender inom hållbarhetstänk. Hoppas vi
            ses där!
          </Text>

          <Group
            gap='xs'
            wrap='nowrap'
            px='xs'
            py='xs'
            justify='center'
            mt='xl'>
            <Box px='xs' py='xs' className='event-info'>
              <Stack align='center' gap='0'>
                <Text size='md'>Datum</Text>
                <Text size='md' fw={600}>
                  mån 19 jan.
                </Text>
              </Stack>
            </Box>

            <Box px='xs' py='xs' className='event-info'>
              <Stack align='center' gap='0'>
                <Text size='md'>Tid</Text>
                <Text size='md' fw={600}>
                  17:00-18:45
                </Text>
              </Stack>
            </Box>

            <Box px='xs' py='xs' className='event-info'>
              <Stack align='center' gap='0'>
                <Text size='md'>Pris</Text>
                <Text size='md' fw={600}>
                  150 kr
                </Text>
              </Stack>
            </Box>
          </Group>

          <Stack gap='xs' mt='xl'>
            <Text fw={600}>Om värden</Text>

            <Group gap='0' wrap='nowrap' className='host-row'>
              <Image
                src='https://images.unsplash.com/photo-1560250097-0b93528c311a'
                w={80}
                className='host-image'
              />

              <Group p='md' wrap='nowrap' className='host-image-information'>
                <Text
                  component={NavLink}
                  to='/profil/:id'
                  className='host-text'
                  pr='md'
                  pl='sm'>
                  Hej! Anders heter jag. Utbildad jurist med miljöfokus och lång
                  erfarenhet av hållbarhetsfrågor. Bor i Kinna, småbarnspappa
                  till Ylva och Melker. På min fritid spelar jag golf, tränar på
                  nya recept med hållbara råvaror, engagerar mig i lokala
                  miljöprojekt och deltar i föreläsningar om hållbar utveckling.
                  Jag hoppas vi ses på något framtida event!
                </Text>
                <NavLink to='/profil/:id' className='host-chevron-link'>
                  <ChevronRight className='host-chevron' />
                </NavLink>
              </Group>
            </Group>
            <Group gap='xs' mt='xl'>
              <FlagIcon className='report-event-icon' />
              <Text className='report-event-text'>Rapportera event</Text>
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 5 }} className='event-second-column'>
          <Box component={NavLink} to='/restaurang/:id'>
            <Image
              src='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/cd/13/32/caption.jpg?w=1400&h=-1&s=1'
              className='restaurant-image'
              height={140}
            />
            <Box p='md' className='restaurant-information'>
              <Text td='none' tt='none' size='sm' fw={600}>
                Noosh, Österlånggatan 35, Borås
              </Text>
              <Group
                pt='sm'
                wrap='nowrap'
                className='restaurant-image-information'>
                <Text
                  component={NavLink}
                  to='/restaurang/:id'
                  td='none'
                  c='dark'
                  size='xs'
                  className='restaurant-text'>
                  Välkommen in till oss på Noosh. I rådhuset på hörnet av Stora
                  torget, får du uppleva den latinamerikanska matkulturen och
                  gemenskapen som sker runt matbordet när du delar ett par
                  smakrika smårätter, en drink i baren eller en helkväll
                  tillsammans med de du tycker om.
                </Text>

                <NavLink
                  to='/restaurant/:id'
                  className='restaurant-chevron-link'>
                  <ChevronRight className='restaurant-chevron' />
                </NavLink>
              </Group>
            </Box>
          </Box>
          <Stack gap='xs' mt='lg'>
            <Image
              src='https://upload.wikimedia.org/wikipedia/commons/3/3e/GNOME_Maps_3.32_screenshot.png'
              h={200}
              bdrs='md'
            />
            <Group gap='xs'>
              <MapPin size='16px' />
              <Text>Österlånggatan 35, 503 31 Borås</Text>
            </Group>
          </Stack>
          <Group gap='xs' mt='xl' wrap='nowrap' className='join-event-group'>
            <BaseButton size='lg' className='join-event-button'>
              Anmäl dig här
            </BaseButton>
            <Flex px='md' py='sm' className='action-icon-button'>
              <BookmarkIcon size={22} />
            </Flex>
            <Flex px='md' py='sm' className='action-icon-button'>
              <Share size={22} />
            </Flex>
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );
}
