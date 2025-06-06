import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

const addOneContact = async () => {
  const allContacts = await readContacts();

  allContacts.push(createFakeContact());
  try {
    await writeContacts(allContacts);
  } catch (error) {
    console.error('Error generating contacts: ', error);
  }
};

addOneContact();
