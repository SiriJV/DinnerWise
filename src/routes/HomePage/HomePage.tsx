import { Flex, SimpleGrid } from '@mantine/core';
import EventCard from '../../components/EventCard/EventCard';
import ImageCarousel from '../../components/ImageCarousel/ImageCarousel';
import './HomePage.scss';
import HeroImage from '../../components/HeroImage/HeroImage';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <HeroImage src='src/assets/hero-image.jpg' alt='Hero Image' top={true} />
      {/* <HeroImage src='src/assets/2.jpg' alt='Hero Image' />
      <HeroImage src='src/assets/3.jpg' alt='Hero Image' /> */}

      <Flex direction='column' gap='md' p='md'>
        <ImageCarousel />

        <SimpleGrid
          cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
          spacing='md'
          mt='lg'>
          <EventCard
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

          <EventCard
            title='Plocka svamp med proffs'
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
          <EventCard
            title='Grundläggande statistik i Excel'
            image='https://cdn.thefork.com/tf-lab/image/upload/restaurant/39ac3238-7869-41f1-adee-45867c734f47/d57afc05-19fa-4fba-a2db-cd738092b887.jpg'
            host='Patrik Eklund'
            hostImage=''
            restaurant='Muchacho'
            address='Vasagatan 5A, Göteborg'
            startTime={new Date('2026-01-22T16:30:00')}
            endTime={new Date('2026-01-22T17:45:00')}
            price={149}
            spots={7}
            maxSpots={8}
            description='Behöver du ha koll på statistik i Excel? Här går vi tillsammans igenom ett enkelt upplägg och ser på olika funktioner som löser dina problem.'
          />
          <EventCard
            title='Planera din vecka med bullet journaling'
            image='https://thatsup.website/storage/379/34769/_DSF0792.jpg?v=1714657166'
            host='Kerstin Wallin'
            hostImage=''
            restaurant='Kalle Glader'
            address='Friggagatan 14B, Göteborg'
            startTime={new Date('2026-02-03T18:30:00')}
            endTime={new Date('2026-02-02T19:30:00')}
            price={85}
            spots={3}
            maxSpots={6}
            description='Bullet journaling är ett kul och kreativt sätt att hålla koll på ditt dagliga schema. Tillsammans går vi igenom olika tekniker och hjälps åt med tips och tricks.'
          />
          <EventCard
            title='Studiecirkel: Förstå EU-valet'
            image='https://i.ytimg.com/vi/EXiwW2bZiT4/maxresdefault.jpg'
            host='Amir Hassan'
            hostImage=''
            restaurant='Pacha Grill'
            address='Linnégatan 74, Göteborg'
            startTime={new Date('2026-01-22T16:30:00')}
            endTime={new Date('2026-01-22T17:45:00')}
            price={149}
            spots={5}
            maxSpots={5}
            description='EU påverkar oss alla, men hur ska vi tänka när vi röstar? Vad är viktigt att veta om de olika partierna och deras ståndpunkter?'
          />
          <EventCard
            title='Lär dig laga vegetariskt'
            image='https://www.lillatavernan.se/wp-content/uploads/2024/08/d3c27d52-1b27-447c-afca-5d405313cbeb.jpg'
            host='Mia Johansson'
            hostImage=''
            restaurant='Lilla Tavernan'
            address='Olivedalsgatan 17, Göteborg'
            startTime={new Date('2026-01-19T17:00:00')}
            endTime={new Date('2026-01-19T19:00:00')}
            price={50}
            spots={6}
            maxSpots={7}
            description='Vegetarisk mat blir allt mer populär. Men hur ersätter du ditt protein och hur gör du maten extra god utan animalier? Det är lättare än du tror!'
          />
          <EventCard
            title='Grundkurs i urban odling'
            image='https://thatsup.se/content/img/place/goteborg/ge/263fe12a-173d-11ef-8e2e-86d7fdd99ed5/gezana-e60e95b0-x2400.jpg'
            host='Markus Thede'
            hostImage=''
            restaurant='Gezana'
            address='Lorensbergsgatan 8, Göteborg'
            startTime={new Date('2026-01-30T18:00:00')}
            endTime={new Date('2026-01-30T19:00:00')}
            price={75}
            spots={8}
            maxSpots={8}
            description='Urban odling ger oss alla en möjlighet att odla växter mitt i stan. Vi snackar vilka växter som är bäst lämpade och hur du gör för att få plats i en liten lägenhet.'
          />
        </SimpleGrid>
      </Flex>
    </>
  );
}
