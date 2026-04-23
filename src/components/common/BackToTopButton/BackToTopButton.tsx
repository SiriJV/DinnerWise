import { Affix, ActionIcon, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 84, right: 20 }} zIndex={999}>
      <Transition transition='slide-up' mounted={scroll.y > 600}>
        {(transitionStyles) => (
          <ActionIcon
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
            variant='filled'
            color='red'
            radius='xl'
            size={56}
            aria-label='Tillbaka till toppen'>
            <ArrowUp size={28} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}
