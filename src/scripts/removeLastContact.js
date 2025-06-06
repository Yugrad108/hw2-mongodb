import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

export const removeLastContact = async () => {
  const allContacts = await readContacts();
  if (!allContacts.length) {
    console.log('No contacts to remove');
    return;
  }
  if (allContacts.length > 0) {
    allContacts.pop();
  }
  try {
    await writeContacts(allContacts);
  } catch (error) {
    console.error('Error removing last contact: ', error);
  }
};

removeLastContact();
