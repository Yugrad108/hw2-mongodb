import { UsersCollection } from '../db/models/users.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/contacts.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../db/models/sessions.js';

// Функция генерации новой сессии с access и refresh токенами и сроками их жизни
const createSession = () => {
  const accessToken = randomBytes(32).toString('base64'); // Генерация access токена (256 бит в base64)
  const refreshToken = randomBytes(64).toString('base64'); // Генерация refresh токена (512 бит в base64)

  return {
    accessToken,
    refreshToken,
    // Время жизни access токена — 15 минут от текущего момента
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    // Время жизни refresh токена — 1 день от текущего момента
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

// Регистрация нового пользователя
export const registerUser = async (payload) => {
  // Проверяем, существует ли пользователь с таким email
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use'); // Если есть - ошибка конфликта

  // Хэшируем пароль для безопасного хранения
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  // Создаём пользователя в базе с хэшированным паролем
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// Логин пользователя и создание новой сессии
export const loginUser = async (payload) => {
  // Находим пользователя по email
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found'); // Ошибка, если отсутствует пользователь
  }
  // Проверяем совпадение паролей
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized'); // Ошибка при неверном пароле
  }

  // Удаляем предыдущую сессию пользователя, чтобы разрешить только одну активную сессию
  await SessionsCollection.deleteOne({ userId: user._id });

  // Создаём новую сессию с токенами и сроками жизни
  const sessionData = createSession();

  // Сохраняем новую сессию в базе и возвращаем её
  return await SessionsCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

// Логаут пользователя — удаление сессии из базы
export const logoutUser = async (sessionId) => {
  // Удаляем сессию по её идентификатору, прекращая доступ пользователя
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// Обновление (рефреш) сессии, выдаёт новые токены по refresh токену
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  // Поиск сессии с указанным sessionId и refreshToken
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  // Если сессия не найдена — ошибка авторизации
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Проверка срока действия refresh токена
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  // Генерация новой сессии с новыми токенами и сроками жизни
  const newSession = createSession();

  // Удаляем старую сессию из базы (чтобы ограничить сессии и избежать накопления)
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  // Создаём новую сессию с тем же userId и новыми токенами
  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
