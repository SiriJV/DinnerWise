import { useState, useEffect } from 'react';
import { Button, Stepper, Group, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { fetchRestaurants, type Restaurant } from '../../../api/restaurants';
import { fetchCategories, type Category } from '../../../api/categories';
import { fetchTags, type Tag } from '../../../api/tags';
import { useAuth } from '../../../contexts/AuthContext';
import RegisteringBaseModal from '../RegisteringBaseModal/RegisteringBaseModal';
import CreateEventStep1 from './CreateEventStep1';
import CreateEventStep2 from './CreateEventStep2';
import CreateEventStep3 from './CreateEventStep3';
import CreateEventStep4 from './CreateEventStep4';

interface EventDetails {
  title: string;
  category: string | null;
  description: string;
  tags: string[];
}

interface SelectedTime {
  date: string;
  time: string;
}

interface CreateEventModalProps {
  opened: boolean;
  onClose: () => void;
}

const generateAvailability = () => {
  const availability: Record<
    number,
    { date: string; slots: { time: string; available: boolean }[] }[]
  > = {};
  const now = new Date(2026, 1, 19);

  for (let restaurantId = 1; restaurantId <= 100; restaurantId++) {
    availability[restaurantId] = [];

    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(now);
        date.setDate(date.getDate() + weekOffset * 7 + dayOffset);

        if (date <= now) continue;

        const dateStr = date.toLocaleDateString('sv-SE', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        const slots = [];
        const timeSlots = [
          '17:00',
          '17:30',
          '18:00',
          '18:30',
          '19:00',
          '19:30',
          '20:00',
          '20:30',
          '21:00',
        ];

        for (const time of timeSlots) {
          slots.push({ time, available: Math.random() > 0.25 });
        }

        availability[restaurantId].push({ date: dateStr, slots });
      }
    }
  }

  return availability;
};

const MOCK_AVAILABILITY = generateAvailability();

const CreateEventModal = ({ opened, onClose }: CreateEventModalProps) => {
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    title: '',
    category: null,
    description: '',
    tags: [],
  });

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [selectedTime, setSelectedTime] = useState<SelectedTime | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [restaurantSearch, setRestaurantSearch] = useState('');

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 480px) and (max-width: 767px)');
  const isMobile = useMediaQuery('(max-width: 479px)');
  const isVerySmall = useMediaQuery('(max-width: 399px)');

  const getStepperSize = () => {
    if (isDesktop) return 'md';
    if (isTablet) return 'sm';
    if (isMobile) return 'xs';
    return 'md';
  };

  useEffect(() => {
    const loadData = async () => {
      if (!opened) return;

      setIsLoading(true);
      try {
        const [categoriesData, tagsData, restaurantsData] = await Promise.all([
          fetchCategories(),
          fetchTags(),
          fetchRestaurants(),
        ]);
        setCategories(categoriesData);
        setAllTags(tagsData);
        setRestaurants(restaurantsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setErrors(['Kunde inte ladda data från servern']);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [opened]);

  const categoryOptions =
    categories.length > 0
      ? categories.map((cat) => ({ value: cat.id.toString(), label: cat.name }))
      : [];

  const tagOptions =
    allTags.length > 0
      ? allTags.map((tag) => ({ value: tag.id.toString(), label: tag.name }))
      : [];

  const [cityFilters, setCityFilters] = useState<number[]>([]);
  const [uniqueCities, setUniqueCities] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const cities = Array.from(
      new Map(
        restaurants.filter((r) => r.city).map((r) => [r.city, r]),
      ).values(),
    );
    const uniqueCityList = cities
      .map((restaurant, idx) => ({
        id: idx,
        name: restaurant.city || '',
      }))
      .filter((city) => city.name);
    setUniqueCities(uniqueCityList);
  }, [restaurants]);

  async function sendBookingEmails() {
    if (!selectedRestaurant || !selectedTime || !eventDetails.title) {
      console.error('Missing event, restaurant, or time info');
      return;
    }
    if (!user || !user.name) {
      console.error(
        'Missing user or user name, cannot send booking emails:',
        user,
      );
      return;
    }

    await fetch('http://localhost:3001/email/send-host-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: selectedRestaurant.name,
        date: selectedTime.date,
        event: eventDetails.title,
        participants: 8,
        eventId: 1,
        name: user.name,
        slug: eventDetails.title.replace(/\s+/g, '-').toLowerCase(),
      }),
    });

    await fetch('http://localhost:3001/email/send-restaurant-booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: selectedRestaurant.name,
        date: selectedTime.date,
        event: eventDetails.title,
        participants: 8,
        eventId: 1,
        name: user.name,
        slug: eventDetails.title.replace(/\s+/g, '-').toLowerCase(),
      }),
    });
  }

  const resetModal = () => {
    setCurrentStep(0);
    setEventDetails({ title: '', category: null, description: '', tags: [] });
    setSelectedRestaurant(null);
    setSelectedTime(null);
    setRestaurantSearch('');
    setCurrentWeekOffset(0);
    setErrors([]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CreateEventStep1
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            categoryOptions={categoryOptions}
            tagOptions={tagOptions}
            errors={errors}
            isLoading={isLoading}
          />
        );
      case 1:
        return (
          <CreateEventStep2
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
            restaurants={restaurants}
            uniqueCities={uniqueCities}
            cityFilters={cityFilters}
            setCityFilters={setCityFilters}
            restaurantSearch={restaurantSearch}
            setRestaurantSearch={setRestaurantSearch}
            errors={errors}
          />
        );
      case 2:
        return (
          <CreateEventStep3
            selectedRestaurant={selectedRestaurant}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            currentWeekOffset={currentWeekOffset}
            setCurrentWeekOffset={setCurrentWeekOffset}
            mockAvailability={MOCK_AVAILABILITY}
            errors={errors}
          />
        );
      case 3:
        return (
          <CreateEventStep4
            eventDetails={eventDetails}
            selectedRestaurant={selectedRestaurant}
            selectedTime={selectedTime}
            categories={categories}
            allTags={allTags}
          />
        );
      default:
        return null;
    }
  };

  return (
    <RegisteringBaseModal
      opened={opened}
      onClose={() => {
        resetModal();
        onClose();
      }}
      title='Skapa Event'
      helpText='Fyll i alla eventdetaljer, välj en restaurang och tidslot. Granska allt innan du skapar eventet. Bekräftelse skickas till dig (värden) och restaurangen.'>
      <Box style={{ flex: 1, overflowY: 'auto' }}>
        {!isVerySmall ? (
          <Box style={{ marginBottom: '24px' }}>
            <Stepper
              active={currentStep}
              onStepClick={setCurrentStep}
              size={getStepperSize()}
              styles={{
                stepIcon: {
                  fontSize: '14px',
                  fontWeight: 500,
                },
                step: {
                  padding: '8px 4px',
                },
              }}>
              <Stepper.Step label='Detaljer' description='Eventinfo' />
              <Stepper.Step label='Restaurang' description='Välj plats' />
              <Stepper.Step label='Tid' description='Välj tid' />
              <Stepper.Step label='Bekräfta' description='Granska' />
            </Stepper>
          </Box>
        ) : null}

        <Box style={{ marginBottom: '20px' }}>{renderStep()}</Box>
      </Box>

      <Box
        style={{
          flex: '0 0 auto',
          borderTop: '1px solid #e9ecef',
          paddingTop: '16px',
        }}>
        <Group gap='12px' justify='space-between'>
          <Button
            variant='default'
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}>
            Tillbaka
          </Button>
          <Group gap='12px'>
            <Button variant='default' onClick={onClose}>
              Avbryt
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={() => {
                  const newErrors: string[] = [];

                  if (currentStep === 0) {
                    if (!eventDetails.title.trim())
                      newErrors.push('Eventtitel krävs');
                    if (!eventDetails.category)
                      newErrors.push('Kategori krävs');
                    if (!eventDetails.description.trim())
                      newErrors.push('Beskrivning krävs');
                  } else if (currentStep === 1) {
                    if (!selectedRestaurant)
                      newErrors.push('Vänligen välj en restaurang');
                  } else if (currentStep === 2) {
                    if (!selectedTime)
                      newErrors.push('Vänligen välj en tidslot');
                  }

                  if (newErrors.length > 0) {
                    setErrors(newErrors);
                    return;
                  }

                  setErrors([]);
                  setCurrentStep(currentStep + 1);
                }}>
                Nästa
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  alert('Event skapat!');
                  resetModal();
                  onClose();
                  await sendBookingEmails();
                }}
                color='red'>
                Skapa
              </Button>
            )}
          </Group>
        </Group>
      </Box>
    </RegisteringBaseModal>
  );
};

export default CreateEventModal;
