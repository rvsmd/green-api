import { createContext, type PropsWithChildren, useContext, useState } from 'react';
import type { ApiCredentials } from '@api/types';
type Value = { credentials: ApiCredentials | null; connect: (value: ApiCredentials) => void };
const Context = createContext<Value | null>(null);
export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [credentials, setCredentials] = useState<ApiCredentials | null>(null);
  return (
    <Context.Provider value={{ credentials, connect: setCredentials }}>{children}</Context.Provider>
  );
};
export const useSession = () => {
  const value = useContext(Context);
  if (!value) throw new Error('SessionProvider is required');
  return value;
};
