import { createContext, useContext, useState, type ReactNode } from 'react';

type PendingAction = 'createEvent' | null;

interface ModalContextType {
  openLogin: (pendingAction?: PendingAction) => void;
  openCreate: () => void;
  closeModals: () => void;
  loginOpen: boolean;
  createOpen: boolean;
  createEventOpen: boolean;
  openCreateEvent: () => void;
  closeCreateEvent: () => void;
  executePendingAction: () => void;
  reportUserOpen: boolean;
  reportUserReason: string | null;
  reportUserDescription: string;
  openReportUser: () => void;
  closeReportUser: () => void;
  setReportUserReason: (reason: string | null) => void;
  setReportUserDescription: (desc: string) => void;
  resetReportUser: () => void;
  reportEventOpen: boolean;
  reportEventReason: string | null;
  reportEventDescription: string;
  openReportEvent: () => void;
  closeReportEvent: () => void;
  setReportEventReason: (reason: string | null) => void;
  setReportEventDescription: (desc: string) => void;
  resetReportEvent: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [reportUserOpen, setReportUserOpen] = useState(false);
  const [reportUserReason, setReportUserReason] = useState<string | null>(null);
  const [reportUserDescription, setReportUserDescription] = useState('');
  const [reportEventOpen, setReportEventOpen] = useState(false);
  const [reportEventReason, setReportEventReason] = useState<string | null>(
    null,
  );
  const [reportEventDescription, setReportEventDescription] = useState('');

  const openLogin = (pending?: PendingAction) => {
    if (pending) {
      setPendingAction(pending);
    }
    setLoginOpen(true);
    setCreateOpen(false);
  };
  const openCreate = () => {
    setCreateOpen(true);
    setLoginOpen(false);
  };
  const closeModals = () => {
    setLoginOpen(false);
    setCreateOpen(false);
  };

  const openCreateEvent = () => {
    setCreateEventOpen(true);
  };
  const closeCreateEvent = () => {
    setCreateEventOpen(false);
  };

  const executePendingAction = () => {
    if (pendingAction === 'createEvent') {
      setCreateEventOpen(true);
    }
    setPendingAction(null);
  };

  const openReportUser = () => setReportUserOpen(true);
  const closeReportUser = () => {
    setReportUserOpen(false);
    resetReportUser();
  };
  const resetReportUser = () => {
    setReportUserReason(null);
    setReportUserDescription('');
  };

  const openReportEvent = () => setReportEventOpen(true);
  const closeReportEvent = () => {
    setReportEventOpen(false);
    resetReportEvent();
  };
  const resetReportEvent = () => {
    setReportEventReason(null);
    setReportEventDescription('');
  };

  return (
    <ModalContext.Provider
      value={{
        openLogin,
        openCreate,
        closeModals,
        loginOpen,
        createOpen,
        createEventOpen,
        openCreateEvent,
        closeCreateEvent,
        executePendingAction,
        reportUserOpen,
        reportUserReason,
        reportUserDescription,
        openReportUser,
        closeReportUser,
        setReportUserReason,
        setReportUserDescription,
        resetReportUser,
        reportEventOpen,
        reportEventReason,
        reportEventDescription,
        openReportEvent,
        closeReportEvent,
        setReportEventReason,
        setReportEventDescription,
        resetReportEvent,
      }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
}
