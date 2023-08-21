import { createLogger, format, transports } from 'winston';
import path from 'path';

import 'winston-mongodb';
const DB_HOST = process.env.DB_HOST || 'mongodb://127.0.0.1:27017';

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      level: 'error',
      filename: path.resolve(__dirname, 'errorLogs.log'),
    }),
    new transports.File({
      level: 'warn',
      filename: path.resolve(__dirname, 'warnLogs.log'),
      format: format.combine(
        format.json(),
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.metadata()
      ),
    }),
    new transports.MongoDB({
      level: 'error',
      db: DB_HOST,
      dbName: process.env.DB_NAME,
      collection: 'server_log',
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.json()
      ),
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.metadata()
  ),
});

export default logger;
