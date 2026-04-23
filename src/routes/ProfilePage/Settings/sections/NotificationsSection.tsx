import { Group, Paper, Stack, Switch, Text } from '@mantine/core';
import { useState } from 'react';

type SettingsRowProps = {
  label: string;
  rightSection: React.ReactNode;
};

const SettingsRow = ({ label, rightSection }: SettingsRowProps) => {
  return (
    <Paper withBorder px='sm' py='xs' radius='sm'>
      <Group justify='space-between'>
        <Text size='sm'>{label}</Text>
        {rightSection}
      </Group>
    </Paper>
  );
};

type NotificationSectionProps = {
  title: string;
  settings: Record<string, boolean>;
  onToggleAll: () => void;
  onToggle: (key: string) => void;
};

function formatLabel(key: string) {
  const map: Record<string, string> = {
    eventUpdates: 'Eventuppdateringar',
    recommendedEvents: 'Rekommenderade event',
    newFollowers: 'Nya följare',
    followingActivity: 'Följda aktiviteter',
    followedEvents: 'Följda event',
    reminders: 'Påminnelser',
    all: 'Alla',
  };
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

const NotificationSection = ({
  title,
  settings,
  onToggleAll,
  onToggle,
}: NotificationSectionProps) => {
  return (
    <Stack gap='xs'>
      {/* RUBRIK */}
      <Text size='sm' fw={600} px='sm'>
        {title}
      </Text>

      {/* ALLA */}
      <SettingsRow
        label={formatLabel('all')}
        rightSection={<Switch checked={settings.all} onChange={onToggleAll} />}
      />

      {/* RESTEN */}
      {Object.entries(settings)
        .filter(([key]) => key !== 'all')
        .map(([key, value]) => (
          <SettingsRow
            key={key}
            label={formatLabel(key)}
            rightSection={
              <Switch
                checked={value}
                onChange={() => onToggle(key)}
                disabled={!settings.all}
              />
            }
          />
        ))}
    </Stack>
  );
};

type NotificationSettingsType = {
  email: {
    all: boolean;
    eventUpdates: boolean;
    recommendedEvents: boolean;
    newFollowers: boolean;
  };
  sms: {
    all: boolean;
    eventUpdates: boolean;
    recommendedEvents: boolean;
  };
  app: {
    all: boolean;
    eventUpdates: boolean;
    recommendedEvents: boolean;
    newFollowers: boolean;
    followingActivity: boolean;
    followedEvents: boolean;
    reminders: boolean;
  };
};

type NotificationType = keyof NotificationSettingsType;

type NotificationsSettingsProps = {
  activeSection: string;
};

export default function NotificationsSettings({
  activeSection,
}: NotificationsSettingsProps) {
  if (activeSection !== 'notifications') return null;

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettingsType>({
      email: {
        all: true,
        eventUpdates: true,
        recommendedEvents: true,
        newFollowers: true,
      },
      sms: {
        all: false,
        eventUpdates: false,
        recommendedEvents: false,
      },
      app: {
        all: true,
        eventUpdates: true,
        recommendedEvents: true,
        newFollowers: true,
        followingActivity: true,
        followedEvents: true,
        reminders: true,
      },
    });

  function handleNestedChange(type: NotificationType, key: string) {
    setNotificationSettings((prev) => {
      const updatedGroup = {
        ...prev[type],
        [key]: !prev[type][key as keyof (typeof prev)[typeof type]],
      };
      const { all, ...rest } = updatedGroup;
      const allFalse = Object.values(rest).every((v) => !v);
      return {
        ...prev,
        [type]: {
          ...updatedGroup,
          all: !allFalse,
        },
      };
    });
  }

  function handleToggleAll(type: NotificationType) {
    setNotificationSettings((prev) => {
      const current = prev[type];
      const newValue = !current.all;
      const updated = Object.keys(current).reduce(
        (acc, key) => {
          acc[key as keyof typeof current] = newValue;
          return acc;
        },
        {} as typeof current,
      );
      return {
        ...prev,
        [type]: updated,
      };
    });
  }

  return (
    <>
      <Text size='sm' c='dimmed'>
        Ändra inställningar för notiser.
      </Text>
      <Stack gap='lg' mt='xs'>
        <NotificationSection
          title='Aviseringar på hemsidan'
          settings={notificationSettings.app}
          onToggleAll={() => handleToggleAll('app')}
          onToggle={(key) => handleNestedChange('app', key)}
        />

        <NotificationSection
          title='E-postaviseringar'
          settings={notificationSettings.email}
          onToggleAll={() => handleToggleAll('email')}
          onToggle={(key) => handleNestedChange('email', key)}
        />

        <NotificationSection
          title='SMS-aviseringar'
          settings={notificationSettings.sms}
          onToggleAll={() => handleToggleAll('sms')}
          onToggle={(key) => handleNestedChange('sms', key)}
        />
      </Stack>
    </>
  );
}
