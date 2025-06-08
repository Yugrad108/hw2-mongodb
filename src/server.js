import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getAllContacts, getContactById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', 3000));

export function setupServer() {
  const app = express();

  app.set('json spaces', 2);

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.status(200).json({
      message: `Server is running, use endpoint '/contacts' and '/contacts/:contactId'`,
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });
  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// вар нерабочий//////////////////////////////////////////////////////////////////

// Константы для HTTP статусов
/**
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

const PORT = Number(getEnvVar('PORT', 3000));

export function setupServer() {
  const app = express();

  // Настройка форматирования JSON для красивого вывода
  app.set('json spaces', 2);

  // Middleware для парсинга JSON запросов
  app.use(express.json());

  // CORS для разрешения кросс-доменных запросов
  app.use(cors());

  // Логирование запросов с помощью pino
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Корневой маршрут - информация о сервере
  app.get('/', (req, res) => {
    res.status(HTTP_STATUS.OK).json({
      message: `Server is running, use endpoint '/contacts' and '/contacts/:contactId'`,
    });
  });

  // Получение всех контактов

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();

      res.status(HTTP_STATUS.OK).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
      // Логирование ошибок
    } catch (error) {
      //    req.log.errorconsole.error('Error getting all contacts');
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: 'Error getting all contacts',
      });
      console.log(error);
    }
  });

  // Получение контакта по его ID

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;

      if (!contactId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: 'Contact ID is required',
        });
      }

      const contact = await getContactById(contactId);

      // Проверка существования контакта
      if (!contact) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          message: 'Contact not found',
        });
      }

      res.status(HTTP_STATUS.OK).json({
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      // Логирование ошибки с контекстом
      //   req.log.error(
      //     error,
      //     `Error getting contact with id ${req.params.contactId}`,
      //  );

      res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: 'Internal server error',
      });
    }
  });

  // Обработка несуществующих маршрутов (должна быть после всех маршрутов)
  app.use('*', (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: 'Not found',
    });
  });

  // Глобальная обработка ошибок (должна быть последней)
  app.use((error, req, res, next) => {
    // Логирование необработанной ошибки
    //    req.log.error(error, 'Unhandled error');

    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      message: 'Something went wrong',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
 */
