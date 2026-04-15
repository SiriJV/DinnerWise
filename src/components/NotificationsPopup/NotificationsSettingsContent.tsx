import { Group, Stack, Text, Switch } from '@mantine/core';
import { useState } from 'react';

export default function NotificationsSettingsContent() {
  const [allSettings, setAllSettings] = useState({
    all: true,
    email: true,
    sms: false,
    eventUpdates: true,
    recommendedEvents: true,
    newFollowers: false,
    followingActivity: true,
  });

  const handleChange = (key: keyof typeof allSettings) => {
    setAllSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };

      const { all, ...rest } = updated;

      const allFalse = Object.values(rest).every((v) => !v);

      return {
        ...updated,
        all: !allFalse,
      };
    });
  };

  const [prevSettings, setPrevSettings] = useState({
    email: true,
    sms: false,
    eventUpdates: true,
    recommendedEvents: true,
    newFollowers: false,
    followingActivity: true,
  });

  const handleToggleAll = () => {
    setAllSettings((prev) => {
      if (prev.all) {
        // går från ON → OFF → spara state
        const { all, ...rest } = prev;
        setPrevSettings(rest);

        return {
          all: false,
          email: false,
          sms: false,
          eventUpdates: false,
          recommendedEvents: false,
          newFollowers: false,
          followingActivity: false,
        };
      } else {
        // går från OFF → ON → återställ
        return {
          all: true,
          ...prevSettings,
        };
      }
    });
  };

  type SwitchGroupProps = {
    label: string;
    value: boolean;
    settingKey: keyof typeof allSettings;
  };

  const SwitchGroup = ({ label, value, settingKey }: SwitchGroupProps) => {
    return (
      <Group justify='space-between'>
        <Text size='sm'>{label}</Text>
        <Switch
          checked={value}
          onChange={() => handleChange(settingKey)}
          disabled={!allSettings.all}
        />
      </Group>
    );
  };

  return (
    <Stack gap='sm' mt='xs'>
      <Group justify='space-between'>
        <Text size='sm'>Alla notiser</Text>{' '}
        <Switch checked={allSettings.all} onChange={handleToggleAll} />
      </Group>
      <SwitchGroup
        label='E-postaviseringar'
        value={allSettings.email}
        settingKey='email'
      />

      <SwitchGroup
        label='SMS-aviseringar'
        value={allSettings.sms}
        settingKey='sms'
      />

      <SwitchGroup
        label='Eventuppdateringar'
        value={allSettings.eventUpdates}
        settingKey='eventUpdates'
      />

      <SwitchGroup
        label='Rekommenderade event'
        value={allSettings.recommendedEvents}
        settingKey='recommendedEvents'
      />

      <SwitchGroup
        label='Nya följare'
        value={allSettings.newFollowers}
        settingKey='newFollowers'
      />

      <SwitchGroup
        label='Personer du följer'
        value={allSettings.followingActivity}
        settingKey='followingActivity'
      />
    </Stack>
  );
}
