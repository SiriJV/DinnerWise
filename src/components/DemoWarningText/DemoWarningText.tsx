import { Text } from '@mantine/core';

type DemoWarningTextProps = { text: string };

export default function DemoWarningText({
  text,
}: DemoWarningTextProps): React.ReactNode {
  return (
    <Text fw={600} c='red'>
      OBS: Det här är en demo-version. {text}
    </Text>
  );
}
