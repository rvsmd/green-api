import { useContext } from 'react';
import { ChatContext } from './ChatContext';

export const useChats = () => {
  const value = useContext(ChatContext);
  if (!value) throw new Error('ChatProvider is required');
  return value;
};
