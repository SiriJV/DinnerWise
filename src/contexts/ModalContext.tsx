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
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

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
