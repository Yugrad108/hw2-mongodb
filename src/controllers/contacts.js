import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

const NOT_FOUND_MSG = 'Contact not found';
const ALLOWED_TYPES = ['home', 'personal', 'work'];

function formatContact(contact) {
  if (!contact) return null;

  return {
    _id: contact._id,
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    email: contact.email,
    isFavourite: contact.isFavourite,
    contactType: contact.contactType,
    userId: contact.userId,
    photo: contact.photo,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  };
}

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    if (
      req.query.contactType !== undefined &&
      filter.contactType === undefined
    ) {
      return next(
        createHttpError(
          400,
          `Invalid contact type filter: '${
            req.query.contactType
          }'. Allowed values: ${ALLOWED_TYPES.join(', ')}.`,
        ),
      );
    }

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });

    if (!contacts) {
      return next(createHttpError(404, NOT_FOUND_MSG));
    }

    const formattedContacts = {
      ...contacts,
      data: contacts.data.map(formatContact),
    };
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: formattedContacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      return next(createHttpError(404, NOT_FOUND_MSG));
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: formatContact(contact),
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const photo = req.file;

    let photoUrl;
    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY')?.toLowerCase() === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const contactData = {
      ...req.body,
      photo: photoUrl,
    };

    const contact = await createContact(contactData, req.user._id);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact',
      data: formatContact(contact),
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file;

    let photoUrl;

    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const updateData = { ...req.body };
    if (photoUrl) {
      updateData.photo = photoUrl;
    }

    const result = await updateContact(contactId, updateData, req.user._id);

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    const contact = result.contact || result;

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: formatContact(contact),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
      return next(createHttpError(404, NOT_FOUND_MSG));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
