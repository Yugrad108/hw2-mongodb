import { faker } from '@faker-js/faker';

export const createFakeContact = () => ({
  id: faker.string.uuid(), //для генерації унікального ідентифікатора;
  name: faker.person.fullName(), // для генерації повних імен;
  phone: faker.phone.number(), // для створення телефонних номерів;
  email: faker.internet.email(), //для формування електронних адрес;
  job: faker.person.jobTitle(), //для генерації назв професій.
});
