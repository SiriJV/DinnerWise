import { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Stepper,
  TextInput,
  Textarea,
  Select,
  Group,
  Stack,
  Text,
  Badge,
  Card,
  Alert,
  MultiSelect,
  Box,
  Center,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  Calendar,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { fetchRestaurants, type Restaurant } from '../../../api/restaurants';
import { fetchCategories, type Category } from '../../../api/categories';
import { fetchTags, type Tag } from '../../../api/tags';
import SearchableFilterDropdown from '../../Filters/SearchFilterDropdown/SearchFilterDropdown';

const HEADER_HEIGHT = 60;
const HEADER_OFFSET = 10;

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
  // Send booking emails to host and restaurant
  async function sendBookingEmails() {
    if (!selectedRestaurant || !selectedTime || !eventDetails.title) return;
    // Host email
    await fetch('http://localhost:3001/email/send-host-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: selectedRestaurant.name,
        date: selectedTime.date,
        event: eventDetails.title,
        participants: 8, // Adjust as needed
        eventId: Math.floor(Math.random() * 100000), // Replace with actual eventId if available
        name: 'Förnamn Efternamn', // Replace with actual host name
        slug: eventDetails.title.replace(/\s+/g, '-').toLowerCase(),
      }),
    });
    // Restaurant email
    await fetch('http://localhost:3001/email/send-restaurant-booking-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: selectedRestaurant.name,
        date: selectedTime.date,
        event: eventDetails.title,
        participants: 8, // Adjust as needed
        eventId: Math.floor(Math.random() * 100000), // Replace with actual eventId if available
        name: 'Förnamn Efternamn', // Replace with actual host name
        slug: eventDetails.title.replace(/\s+/g, '-').toLowerCase(),
      }),
    });
  }
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

  const filteredByCity =
    cityFilters.length > 0
      ? restaurants.filter((r) => {
          const cityIndex = uniqueCities.findIndex((c) => c.name === r.city);
          return cityIndex !== -1 && cityFilters.includes(cityIndex);
        })
      : restaurants;
  const filteredBySearch = filteredByCity.filter((r) =>
    r.name.toLowerCase().includes(restaurantSearch.toLowerCase()),
  );

  const renderStep1 = () => {
    if (isLoading) {
      return (
        <Stack gap='md'>
          <Text c='dimmed'>Laddar kategorier...</Text>
        </Stack>
      );
    }
    return (
      <Stack gap='md'>
        {errors.length > 0 && (
          <Alert
            icon={<AlertCircle size={16} />}
            color='red'
            title='Valideringsfel'>
            <ul style={{ marginLeft: 20 }}>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}
        <TextInput
          label='Titel'
          placeholder='Ge ditt event en titel'
          value={eventDetails.title}
          onChange={(e) =>
            setEventDetails({ ...eventDetails, title: e.currentTarget.value })
          }
          required
        />
        <Select
          label='Kategori'
          placeholder='Välj en passande kategori'
          data={categoryOptions}
          value={eventDetails.category}
          onChange={(value) =>
            setEventDetails({ ...eventDetails, category: value })
          }
          required
          searchable
          clearable
          nothingFoundMessage='Ingen kategori hittades'
          styles={{ dropdown: { zIndex: 9999 } }}
        />
        <Textarea
          label='Beskrivning'
          placeholder='Beskriv ditt event...'
          value={eventDetails.description}
          onChange={(e) =>
            setEventDetails({
              ...eventDetails,
              description: e.currentTarget.value,
            })
          }
          rows={4}
          required
        />
        <MultiSelect
          label='Taggar (valfritt)'
          placeholder='Sök och välj passande taggar'
          data={tagOptions}
          value={eventDetails.tags}
          onChange={(values) =>
            setEventDetails({ ...eventDetails, tags: values })
          }
          searchable
          clearable
        />
      </Stack>
    );
  };

  const renderStep2 = () => {
    return (
      <Stack gap='md'>
        {errors.length > 0 && (
          <Alert
            icon={<AlertCircle size={16} />}
            color='red'
            title='Valideringsfel'>
            {errors[0]}
          </Alert>
        )}
        <TextInput
          placeholder='Sök restaurang...'
          leftSection={<Search size={16} />}
          value={restaurantSearch}
          onChange={(e) => setRestaurantSearch(e.currentTarget.value)}
        />

        <Stack gap='xs'>
          <SearchableFilterDropdown
            fetchUrl='http://localhost:3001/cities'
            label='Stad'
            onApply={(selected: Array<{ id: number; name: string }>) => {
              const selectedIds = selected.map(
                (city: { id: number; name: string }) => {
                  const idx = uniqueCities.findIndex(
                    (c: { id: number; name: string }) => c.name === city.name,
                  );
                  return idx;
                },
              );
              setCityFilters(selectedIds.filter((id: number) => id !== -1));
            }}
          />
        </Stack>
        <Stack gap='sm'>
          {filteredBySearch.length > 0 ? (
            filteredBySearch.map((restaurant) => (
              <Card
                key={restaurant.id}
                padding='md'
                radius='md'
                withBorder
                style={{
                  cursor: 'pointer',
                  borderWidth: 2,
                  borderColor:
                    selectedRestaurant?.id === restaurant.id
                      ? '#b21515ff'
                      : '#dee2e6',
                  backgroundColor:
                    selectedRestaurant?.id === restaurant.id
                      ? '#ffe7e7ff'
                      : 'white',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  setErrors([]);
                }}>
                <Group justify='space-between' mb='xs'>
                  <div>
                    <Text fw={500}>{restaurant.name}</Text>
                    <Text size='sm' c='dimmed'>
                      {restaurant.city}
                    </Text>
                  </div>
                </Group>
                <Text size='sm'>{restaurant.address_string}</Text>
              </Card>
            ))
          ) : (
            <Center py='xl'>
              <Text size='sm' c='dimmed'>
                Inga restauranger hittades
              </Text>
            </Center>
          )}
        </Stack>
      </Stack>
    );
  };

  const renderStep3 = () => {
    if (!selectedRestaurant) return null;
    const availability =
      MOCK_AVAILABILITY[
        selectedRestaurant.id as keyof typeof MOCK_AVAILABILITY
      ] || [];
    const visibleDates = availability.slice(
      currentWeekOffset * 7,
      currentWeekOffset * 7 + 7,
    );
    const canGoPrev = currentWeekOffset > 0;
    const canGoNext = currentWeekOffset < 3;
    return (
      <Stack gap='md'>
        {errors.length > 0 && (
          <Alert
            icon={<AlertCircle size={16} />}
            color='red'
            title='Valideringsfel'>
            {errors[0]}
          </Alert>
        )}

        <Group justify='space-between' align='center' gap='md'>
          <Button
            variant='light'
            size='sm'
            onClick={() => setCurrentWeekOffset((p) => p - 1)}
            disabled={!canGoPrev}
            leftSection={<ChevronLeft size={16} />}></Button>

          <Text
            fw={500}
            size='sm'
            style={{ minWidth: '120px', textAlign: 'center' }}>
            Vecka {currentWeekOffset + 1} av 4
          </Text>

          <Button
            variant='light'
            size='sm'
            onClick={() => setCurrentWeekOffset((p) => p + 1)}
            disabled={!canGoNext}
            rightSection={<ChevronRight size={16} />}></Button>
        </Group>

        <Stack gap='lg' pr='md'>
          {visibleDates.length > 0 ? (
            visibleDates.map((slot, idx) => (
              <Card key={idx} padding='md' radius='md' withBorder>
                <Stack gap='xs'>
                  <Text
                    fw={500}
                    size='sm'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                    <Calendar size={16} />
                    {slot.date}
                  </Text>
                  <Group gap='xs' wrap='wrap'>
                    {slot.slots.map((slotData) => (
                      <Button
                        key={slotData.time}
                        variant={
                          selectedTime?.date === slot.date &&
                          selectedTime?.time === slotData.time
                            ? 'filled'
                            : 'light'
                        }
                        onClick={() => {
                          if (slotData.available) {
                            setSelectedTime({
                              date: slot.date,
                              time: slotData.time,
                            });
                            setErrors([]);
                          }
                        }}
                        size='xs'
                        disabled={!slotData.available}
                        leftSection={<Clock size={14} />}
                        style={{
                          opacity: slotData.available ? 1 : 0.5,
                        }}
                        title={!slotData.available ? 'Inte tillgänglig' : ''}>
                        {slotData.time}
                      </Button>
                    ))}
                  </Group>
                </Stack>
              </Card>
            ))
          ) : (
            <Center py='xl'>
              <Text size='sm' c='dimmed'>
                Inga tillgängliga datum denna vecka
              </Text>
            </Center>
          )}
        </Stack>
      </Stack>
    );
  };

  const renderStep4 = () => {
    const categoryName = categories.find(
      (c) => c.id.toString() === eventDetails.category,
    )?.name;
    const selectedTagNames = allTags
      .filter((tag) => eventDetails.tags.includes(tag.id.toString()))
      .map((tag) => tag.name);

    return (
      <Stack gap='md'>
        <Alert
          icon={<AlertCircle size={16} />}
          color='red'
          title='Granska ditt event'>
          Vänligen bekräfta alla detaljer innan du skapar ditt event.
        </Alert>

        <Card padding='md' radius='md' withBorder>
          <Text fw={500} mb='md'>
            Eventdetaljer
          </Text>
          <Stack gap='xs' ml='md'>
            <Text size='sm'>
              <strong>Titel:</strong> {eventDetails.title}
            </Text>
            <Text size='sm'>
              <strong>Kategori:</strong> {categoryName}
            </Text>
            <Text size='sm'>
              <strong>Beskrivning:</strong> {eventDetails.description}
            </Text>
            {selectedTagNames.length > 0 && (
              <div>
                <Text size='sm' mb='xs'>
                  <strong>Taggar:</strong>
                </Text>
                <Group gap='xs' ml='md'>
                  {selectedTagNames.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </Group>
              </div>
            )}
          </Stack>
        </Card>

        <Card padding='md' radius='md' withBorder>
          <Text fw={500} mb='md'>
            Restaurang
          </Text>
          <Stack gap='xs' ml='md'>
            <Text size='sm'>
              <strong>Namn:</strong> {selectedRestaurant?.name}
            </Text>
            <Text size='sm'>
              <strong>Stad:</strong> {selectedRestaurant?.city}
            </Text>
            <Text size='sm'>
              <strong>Adress:</strong> {selectedRestaurant?.address_string}
            </Text>
          </Stack>
        </Card>

        <Card padding='md' radius='md' withBorder>
          <Text fw={500} mb='md'>
            Datum & Tid
          </Text>
          <Stack gap='xs' ml='md'>
            <Text size='sm'>
              <strong>Datum:</strong> {selectedTime?.date}
            </Text>
            <Text size='sm'>
              <strong>Tid:</strong> {selectedTime?.time}
            </Text>
          </Stack>
        </Card>
      </Stack>
    );
  };

  const resetModal = () => {
    setCurrentStep(0);
    setEventDetails({ title: '', category: null, description: '', tags: [] });
    setSelectedRestaurant(null);
    setSelectedTime(null);
    setRestaurantSearch('');
    setCurrentWeekOffset(0);
    setErrors([]);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        resetModal();
        onClose();
      }}
      title='Skapa Event'
      size='xl'
      centered
      styles={{
        content: {
          maxHeight: `calc(100vh - ${HEADER_HEIGHT + HEADER_OFFSET}px)`,
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          padding: '24px',
        },
      }}
      zIndex={1000}
      withinPortal={true}>
      {!isVerySmall ? (
        <Box style={{ marginBottom: '24px', flex: '0 0 auto' }}>
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

      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'visible',
          marginBottom: '16px',
          position: 'relative',
        }}>
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
      </Box>

      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid #e9ecef',
          flex: '0 0 auto',
        }}>
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
                  if (!eventDetails.category) newErrors.push('Kategori krävs');
                  if (!eventDetails.description.trim())
                    newErrors.push('Beskrivning krävs');
                } else if (currentStep === 1) {
                  if (!selectedRestaurant)
                    newErrors.push('Vänligen välj en restaurang');
                } else if (currentStep === 2) {
                  if (!selectedTime) newErrors.push('Vänligen välj en tidslot');
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
              onClick={() => {
                alert('Event skapat!');
                resetModal();
                onClose();
                sendBookingEmails();
              }}
              color='red'>
              Skapa
            </Button>
          )}
        </Group>
      </Box>
    </Modal>
  );
};

export default CreateEventModal;
