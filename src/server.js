import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import Router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

// Берём порт из переменных окружения с дефолтом 3000
const PORT = Number(getEnvVar('PORT', 3000));

export function setupServer() {
  const app = express();

  // Настройка красивого форматирования JSON-ответов
  app.set('json spaces', 2);

  // Включаем парсинг куки
  app.use(cookieParser());

  // Парсинг json тела запросов
  app.use(express.json());

  // Включаем CORS, чтобы разрешить кросс-доменные запросы
  app.use(cors());

  // Логирование HTTP запросов с помощью pino в удобочитаемом формате
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Корневой маршрут для проверки работоспособности сервера
  app.get('/', (req, res) => {
    res.status(200).json({
      message: `Server is running, use endpoint '/contacts' and '/contacts/:contactId'`,
    });
  });

  // Подключаем главный маршрутизатор со всеми API роутами (например, /users, /auth, /contacts)
  app.use(Router);

  // Middleware для обработки запросов, которые не попали ни на один маршрут (404)
  app.use(notFoundHandler);

  // Глобальный обработчик ошибок, который ловит и отвечает на все ошибки в цепочке
  app.use(errorHandler);

  // Запускаем сервер и слушаем указанный порт
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
