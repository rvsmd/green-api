import { type PropsWithChildren, useState } from 'react';

import type { ApiCredentials } from '@api/types';

import { SessionContext } from './SessionContext';

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [credentials, setCredentials] = useState<ApiCredentials | null>(null);

  return (
    <SessionContext.Provider value={{ credentials, connect: setCredentials }}>
      {children}
    </SessionContext.Provider>
  );
};
