import type { EventType } from '../../../types/EventType';
import { generateEventSlug } from '../../../utils/slugify';
import { useState } from 'react';
import { APP_CONFIG } from '../../../config/appConfig';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';
import PaymentModal from './PaymentModal/PaymentModal';
import RegisteringModal from './RegisteringModal/RegisteringModal';
import ShareModal from '../ShareModal/ShareModal';
import WaitlistConfirmationModal from './WaitlistConfirmationModal/WaitlistConfirmationModal';

type EventRegistrationModalProps = {
  event: EventType | null;
  register: any;
  payment: any;
  confirmation: any;
  waitlist: any;
  share: any;
};

interface Participant {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export default function EventRegistrationModal({
  event,
  register,
  payment,
  confirmation,
  waitlist,
  share,
}: EventRegistrationModalProps) {
  const [participant, setParticipant] = useState<Participant>({
    firstName: APP_CONFIG.exampleUserFirstName || 'Förnamn',
    lastName: APP_CONFIG.exampleUserLastName || 'Efternamn',
    phone: APP_CONFIG.exampleUserTelephone || '+46701234567',
    email: APP_CONFIG.exampleUserEmail || 'exempel@epost.se',
  });

  return (
    <>
      <RegisteringModal
        opened={register.opened}
        onClose={register.close}
        onOpenPayment={payment.open}
        onOpenWaitlist={waitlist.open}
        event={event!}
        participant={participant}
        setParticipant={setParticipant}
        showBackButton={false}
      />

      <PaymentModal
        opened={payment.opened}
        onClose={payment.close}
        onOpenConfirmation={confirmation.open}
        onOpenRegistration={register.open}
        event={event}
        participant={participant}
      />

      <ConfirmationModal
        opened={confirmation.opened}
        onClose={confirmation.close}
        onOpenPayment={payment.open}
        event={event}
        participant={participant}
        showBackButton={false}
        cancelButtonText='Gå till event'
      />

      <ShareModal
        opened={share.opened}
        onClose={share.close}
        eventUrl={
          event
            ? `http://localhost:5173/event/${generateEventSlug(event.title, event.id)}`
            : ''
        }
        eventName={event ? event.title : ''}
      />

      <WaitlistConfirmationModal
        opened={waitlist.opened}
        onClose={waitlist.close}
        onOpenWaitlist={register.open}
        event={event}
      />
    </>
  );
}
