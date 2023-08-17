// const express = require('express');
import express from 'express';
import { NextFunction, Request, Response } from 'express';
import expressWinston from 'express-winston';
import createError from 'http-errors';
import { transports, format } from 'winston';

require('dotenv').config();

import logger from './src/log/logger';
import authRoute from './src/components/auth/auth.router';
import companyRoute from './src/components/company/company.route';
import employeeRoute from './src/components/employee/employee.route';

import initMongo from './src/helper/mongoDB';

import { verifyAccessToken } from './src/utils/jwtHelper';

initMongo();

const app = express();
app.use(express.json());

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

app.get(
  '/',
  verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello this is home route');
  }
);

// Routes
app.use('/auth', authRoute);
app.use('/company', companyRoute);
app.use('/api/employee', employeeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on ', PORT);
});

const errorFormat = format.printf(({ level, timestamp, meta }: any) => {
  return `${timestamp} ${level}: ${meta.message}`;
});

app.use(
  expressWinston.errorLogger({
    transports: [
      new transports.File({
        filename: './src/log/logsInternalErrors.log',
      }),
    ],
    format: format.combine(format.json(), format.timestamp(), errorFormat),
  })
);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message,
  });
});
