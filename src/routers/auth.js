import { Router } from 'express';
// Middleware для валидации тела запроса по заданной схеме (Joi)
import { validateBody } from '../middlewares/validateBody.js';

// Импорт схем валидации тела запроса для регистрации и логина пользователей
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';

// Контроллеры для аутентификационных операций: регистрация, логин, логаут и обновление сессии
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';

// Обёртка для контроллеров, чтобы автоматически обрабатывать ошибки (try/catch)
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

// POST /register — эндпоинт для регистрации пользователя
// Перед выполнением контроллера:
// - Валидация тела запроса по схеме registerUserSchema
// - Оборачивание контроллера ctrlWrapper для централизованной обработки ошибок
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

// POST /login — эндпоинт для входа пользователя
// Аналогично валидация тела по loginUserSchema и обёртка контроллера
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

// POST /logout — логаут (выход) пользователя
// Валидация тела запроса не нужна, просто вызывает контроллер через ctrlWrapper
router.post('/logout', ctrlWrapper(logoutUserController));

// POST /refresh — обновление пользовательской сессии (например, новый access токен по refresh токену)
// Просто вызов контроллера через ctrlWrapper
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

// Экспортируем маршрутизатор для подключения в основном приложении
export default router;
