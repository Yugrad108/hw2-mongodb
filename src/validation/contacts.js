import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Phone number must be 7 to 15 digits and may start with "+". Only digits are allowed after the optional plus sign.',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().email().allow(null),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = createContactSchema.fork(
  ['name', 'phoneNumber', 'contactType'],
  (field) => field.optional(),
);
