import { readContacts } from '../utils/readContacts.js';

export const getAllContacts = async () => {
  const allContacts = await readContacts();
  return allContacts;
};

console.log(await getAllContacts());
