import type { UserSession } from "@/lib/types/UserTypes";
import { createContext, useState } from "react";

export type AuthenticatedContextType = {
  userData: UserSession | null;
  setUserData: (userData: UserSession | null) => void;
};

export const AuthenticatedContext = createContext<AuthenticatedContextType>({
  userData: null,
  setUserData: () => {},
});

const AuthenticatedProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserSession | null>(null);

  const value = {
    userData,
    setUserData,
  };

  return (
    <AuthenticatedContext.Provider value={value}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

export default AuthenticatedProvider;
