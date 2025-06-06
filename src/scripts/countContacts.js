import { readContacts } from '../utils/readContacts.js';

export const countContacts = async () => {
  const allContacts = await readContacts();
  return allContacts.length;
};

console.log(await countContacts());
