// function parseNumber(value, defaultValue) {
//   const isString = typeof value === 'string';
//   if (isString !== true) {
//     return defaultValue;
//   }

//   const parsedNumber = parseInt(value);

//   if (Number.isNaN(parsedNumber)) {
//     return defaultValue;
//   }

//   return parsedNumber;
// }

// export function parsePaginationParams(query) {
//   const { page, perPage } = query;

//   const parsedPage = parseNumber(page, 1);
//   const parsedPerPage = parseNumber(perPage, 10);

//   return {
//     page: parsedPage,
//     perPage: parsedPerPage,
//   };
// }

// const parseNumber = (value, defaultValue) => {
//   const isString = typeof value === 'string';
//   if (!isString) return defaultValue;

//   const parseNumber = parseInt(value);
//   if (Number.isNaN(parseNumber)) return defaultValue;

//   return parseNumber;
// };

// export const parsePaginationParams = (query) => {
//   const { page, perPage } = query;
//   const parsedPage = parseNumber(page, 1);
//   const parsedPerPage = parseNumber(perPage, 10);

//   return {
//     page: parsedPage,
//     perPage: parsedPerPage,
//   };
// };

const parseNumber = (value, defaultValue) => {
  const isString = typeof value === 'string';
  if (!isString) return defaultValue;

  const parseNumber = parseInt(value);
  if (Number.isNaN(parseNumber)) return defaultValue;

  return parseNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
