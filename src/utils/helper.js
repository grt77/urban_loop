import { v4 as uuidv4 } from 'uuid';

export const generateSessionId = () => {
  // Generate a UUID and extract the first 16 characters
  return uuidv4().replace(/-/g, '').slice(0, 16);
}

  