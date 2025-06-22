export const calculatePaginationData = (page, perPage, totalItems) => {
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / perPage) : 1;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && page <= totalPages,
  };
};

// export const calculatePaginationData = (page, perPage, totalItems) => {
//   const totalPages = totalItems > 0 ? Math.ceil(totalItems / perPage) : 1;
//   const validPage = Math.max(1, Math.min(page, totalPages));

//   return {
//     page: validPage,
//     perPage,
//     totalItems,
//     totalPages,
//     hasNextPage: validPage < totalPages,
//     hasPreviousPage: validPage > 1,
//   };
// };
