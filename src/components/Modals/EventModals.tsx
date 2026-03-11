import type { EventType } from '../../types/EventType';
import { generateEventSlug } from '../../utils/slugify';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';
import PaymentModal from './PaymentModal/PaymentModal';
import RegisteringModal from './RegisteringModal/RegisteringModal';
import ShareModal from './ShareModal/ShareModal';
import WaitlistConfirmationModal from './WaitlistConfirmationModal/WaitlistConfirmationModal';

type Props = {
  event: EventType | null;
  register: any;
  payment: any;
  confirmation: any;
  waitlist: any;
  share: any;
};

export default function EventModals({
  event,
  register,
  payment,
  confirmation,
  waitlist,
  share,
}: Props) {
  return (
    <>
      <RegisteringModal
        opened={register.opened}
        onClose={register.close}
        onOpenPayment={payment.open}
        onOpenWaitlist={waitlist.open}
        event={event!}
      />

      <PaymentModal
        opened={payment.opened}
        onClose={payment.close}
        onOpenConfirmation={confirmation.open}
        onOpenRegistration={register.open}
        event={event}
      />

      <ConfirmationModal
        opened={confirmation.opened}
        onClose={confirmation.close}
        onOpenPayment={payment.open}
        event={event}
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
