const parseName = (name) => {
  return typeof name === 'string' ? name.trim() : undefined;
};

const parsePhoneNumber = (phoneNumber) => {
  return typeof phoneNumber === 'string' ? phoneNumber.trim() : undefined;
};

const parseEmail = (email) => {
  return typeof email === 'string' ? email.trim() : undefined;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return undefined;
  const lowered = isFavourite.toLowerCase();
  if (lowered === 'true') return true;
  if (lowered === 'false') return false;
  return undefined;
};

const parseType = (contactType) => {
  if (typeof contactType !== 'string') return undefined;

  const allowedTypes = ['home', 'personal', 'work'];
  const trimmedType = contactType.trim().toLowerCase();

  if (allowedTypes.includes(trimmedType)) {
    return trimmedType;
  }

  return undefined;
};

export const parseFilterParams = (query) => {
  const { name, phoneNumber, email, isFavourite, contactType } = query;

  return {
    name: parseName(name),
    phoneNumber: parsePhoneNumber(phoneNumber),
    email: parseEmail(email),
    isFavourite: parseIsFavourite(isFavourite),
    contactType: parseType(contactType),
  };
};
