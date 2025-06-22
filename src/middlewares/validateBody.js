import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad request', { errors: err.details });
    next(error);
  }
};

// import createHttpError from 'http-errors';

// /**
//  * Middleware валидации тела запроса.
//  * Возвращает в ошибке:
//  * - message: строку со всеми ошибками через запятую
//  * - errors: подробный массив ошибок от Joi (или вашей валидации)
//  *
//  * @param {Joi.Schema} schema - Joi-схема для валидации тела запроса
//  */
// export const validateBody = (schema) => async (req, res, next) => {
//   try {
//     await schema.validateAsync(req.body, { abortEarly: false });
//     next();
//   } catch (err) {
//     // Собираем все сообщения валидатора в одну строку
//     const messages =
//       err.details?.map((e) => e.message).join(', ') || 'Validation error';
//     // Формируем ошибку 400 c подробностями
//     const error = createHttpError(400, messages, { errors: err.details });
//     next(error);
//   }
// };
