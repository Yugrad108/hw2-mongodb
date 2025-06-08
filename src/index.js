import { initMongoDB } from './db/initMongoConnections.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};

bootstrap();
