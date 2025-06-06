import { PATH_DB } from '../constants/contacts.js';
import { writeFile } from 'node:fs/promises';

export const writeContacts = async (newContacts) => {
  const data = JSON.stringify(newContacts, null, 2);
  try {
    await writeFile(PATH_DB, data, 'utf8');
  } catch (error) {
    console.error('Error writing contacts: ', error);
  }
};
