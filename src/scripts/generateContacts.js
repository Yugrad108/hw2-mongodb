import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

const generateContacts = async (number) => {
  const allContacts = await readContacts();

  for (let i = 0; i < number; i++) {
    allContacts.push(createFakeContact());
  }
  //   console.log(allContacts);
  try {
    await writeContacts(allContacts);
  } catch (error) {
    console.error('Error generating contacts: ', error);
  }
};

generateContacts(5);
