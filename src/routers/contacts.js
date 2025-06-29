import { Router } from 'express';
// Импортируем контроллеры для CRUD операций с контактами
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
// Обёртка для контроллеров, чтобы автоматически обрабатывать ошибки (try/catch)
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// Middleware для валидации тела запроса по схеме Joi
import { validateBody } from '../middlewares/validateBody.js';
// Middleware для проверки валидности идентификатора contactId в URL
import { isValidId } from '../middlewares/isValidId.js';
// Импорт схем валидации для создания и обновления контактов
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
// Middleware аутентификации, проверяющий авторизован ли пользователь
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

// Все маршруты ниже будут защищены авторизацией — вызов middleware authenticate
router.use(authenticate);

// GET / — получение списка всех контактов с учётом параметров фильтрации, пагинации и сортировки
router.get('/', ctrlWrapper(getContactsController));

// GET /:contactId — получение одного контакта по ID
// Сначала проверяем валидность id через isValidId, затем вызываем контроллер с обработкой ошибок
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// POST / — создание нового контакта
// Валидация тела запроса по createContactSchema, затем вызывается контроллер
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// PATCH /:contactId — обновление существующего контакта по ID
// Проверяется валидность id, валидируется тело по updateContactSchema, затем вызывается контроллер
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

// DELETE /:contactId — удаление контакта по ID
// Проверка валидного id и вызов контроллера с обработкой ошибок
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

// Экспорт маршрутизатора контактов для подключения к основному приложению
export default router;
