import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/sessions.js';
import { UsersCollection } from '../db/models/users.js';

export const authenticate = async (req, res, next) => {
  // Получаем заголовок Authorization из запроса
  const authHeader = req.get('Authorization');

  // Проверяем наличие заголовка, если его нет — возвращаем 401 Unauthorized
  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  // Разбиваем значение заголовка по пробелу, ожидая формат: "Bearer <token>"
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  // Проверяем правильность формата заголовка (тип должен быть "Bearer", токен должен быть)
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  // Ищем сессию в базе по accessToken, который передаем в заголовке
  const session = await SessionsCollection.findOne({ accessToken: token });

  // Если сессия не найдена — значит либо токен неверный, либо сессия устарела
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  // Проверяем не истёк ли срок действия accessToken
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // По найденной сессии берём userId и ищем пользователя в базе
  const user = await UsersCollection.findById(session.userId);

  // Если пользователь не найден (например, удалён) — отказать в доступе
  if (!user) {
    return next(createHttpError(401));
  }

  // Добавляем объект пользователя в объект запроса,
  // чтобы дальше в роутерах и контроллерах можно было обращаться к текущему юзеру через req.user
  req.user = user;

  // Вызываем следующий middleware или контроллер
  next();
};
