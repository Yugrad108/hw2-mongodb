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

// ❌ Проблемы с фильтрацией, не фильтрует по типам ['home', 'personal', 'work']
// const parseType = (contactType) => {
//   const isString = typeof contactType === 'string';
//   if (!isString) return;
//   const allowedTypes = (type) => ['home', 'personal'];// ❌ Это функция, а не массив!

//   if (allowedTypes.includes(contactType)) return contactType; // ❌ У функции нет метода includes
//   return undefined;
// };

// ✅ Исправление фильтрации, фильтрует по типам ['home', 'personal', 'work']
const parseType = (contactType) => {
  if (typeof contactType !== 'string') return undefined;

  const allowedTypes = ['home', 'personal', 'work']; //  Теперь это массив
  const trimmedType = contactType.trim().toLowerCase();

  // Проверяем, есть ли тип в разрешенных
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
