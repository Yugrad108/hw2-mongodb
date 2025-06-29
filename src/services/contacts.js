import { SORT_ORDER } from '../constants/contacts.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const dbFilter = { userId };

  if (typeof filter.name === 'string' && filter.name.trim()) {
    dbFilter.name = { $regex: filter.name.trim(), $options: 'i' };
  }
  if (typeof filter.phoneNumber === 'string' && filter.phoneNumber.trim()) {
    dbFilter.phoneNumber = { $regex: filter.phoneNumber.trim() };
  }
  if (typeof filter.email === 'string' && filter.email.trim()) {
    dbFilter.email = { $regex: filter.email.trim(), $options: 'i' };
  }
  if (typeof filter.isFavourite === 'boolean') {
    dbFilter.isFavourite = filter.isFavourite;
  }
  if (typeof filter.contactType === 'string' && filter.contactType.trim()) {
    dbFilter.contactType = filter.contactType.trim();
  }

  const [totalItems, data] = await Promise.all([
    ContactsCollection.countDocuments(dbFilter),
    ContactsCollection.find(dbFilter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload, userId) => {
  const contactPayload = { ...payload, userId };
  return ContactsCollection.create(contactPayload);
};

export const updateContact = async (contactId, payload, userId) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};
