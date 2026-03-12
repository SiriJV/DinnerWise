import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { id: number; name: string } | null;
  login: (user?: { id: number; name: string }) => void;
  logout: () => void;
  bookmarks: number[];
  addBookmark: (id: number) => void;
  removeBookmark: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const login = (userObj?: { id: number; name: string }) => {
    setIsLoggedIn(true);
    setUser(userObj || { id: 1, name: 'Demo User' });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setBookmarks([]);
  };

  const addBookmark = (id: number) => {
    setBookmarks((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((b) => b !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        bookmarks,
        addBookmark,
        removeBookmark,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
