import { useContext } from 'react';
import { SessionContext } from './SessionContext';

export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) throw new Error('SessionProvider is required');
  return value;
};
