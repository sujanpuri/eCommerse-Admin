// context/UserContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ✅ Step 1: Define user type
type User = {
  id: string;
  name: string;
  email: string;
};

// ✅ Step 2: Define context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// ✅ Step 3: Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// ✅ Step 4: Create provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Step 5: Create custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
