import { createContext, useContext, useState, type ReactNode } from 'react';

interface ModalContextType {
  openLogin: () => void;
  openCreate: () => void;
  closeModals: () => void;
  loginOpen: boolean;
  createOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const openLogin = () => {
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

  return (
    <ModalContext.Provider
      value={{ openLogin, openCreate, closeModals, loginOpen, createOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
}
