import { createContext } from 'react';
import type { ApiCredentials } from '@api/types';

export type SessionContextValue = {
  credentials: ApiCredentials | null;
  connect: (value: ApiCredentials) => void;
};

export const SessionContext = createContext<SessionContextValue | null>(null);
