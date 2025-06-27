import { SORT_ORDER } from '../constants/contacts.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const dbFilter = {};

  if (typeof filter.name === 'string' && filter.name.trim()) {
    dbFilter.name = { $regex: filter.name, $options: 'i' };
  }
  if (filter.phoneNumber) {
    dbFilter.phoneNumber = { $regex: filter.phoneNumber };
  }
  if (typeof filter.email === 'string' && filter.email.trim()) {
    dbFilter.email = { $regex: filter.email, $options: 'i' };
  }
  if (typeof filter.isFavourite === 'boolean') {
    dbFilter.isFavourite = filter.isFavourite;
  }
  if (filter.contactType) {
    dbFilter.contactType = filter.contactType;
  }

  // ✅ Улучшенная проверка contactType
  if (typeof filter.contactType === 'string' && filter.contactType.trim()) {
    dbFilter.contactType = filter.contactType.trim();
  }

  console.log('DB Filter:', dbFilter); // ✅ Для отладки

  const totalItems = await ContactsCollection.countDocuments(dbFilter);

  const data = await ContactsCollection.find(dbFilter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(page, perPage, totalItems);

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  return ContactsCollection.findById(contactId);
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const updateContact = async (
  contactId,
  payload,
  options = { new: true },
) => {
  return ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    options,
  );
};

export const deleteContact = async (contactId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId });
};
