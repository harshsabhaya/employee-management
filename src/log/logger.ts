import { createLogger, format, transports } from 'winston';
import path from 'path';

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
    }),
  ],
  format: format.combine(format.json(), format.timestamp(), format.metadata()),
});

export default logger;
