// MongoDB real (binario mongod) para desarrollo sin Docker. Persiste en .local-db/
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'node:fs';

fs.mkdirSync('.local-db', { recursive: true });
const server = await MongoMemoryServer.create({
  instance: { port: 27017, dbPath: '.local-db', storageEngine: 'wiredTiger' },
});
console.log(`MongoDB escuchando en ${server.getUri()}`);
