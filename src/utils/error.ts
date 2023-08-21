// Only wrap async function with this function
import { NextFunction, Request, Response } from 'express';
// import mongoose from 'mongoose';
const mongoose = require('mongoose');
import createError from 'http-errors';

export function asyncErrorHandler(func: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err: any) => {
      let error = err;

      if (err instanceof mongoose.CastError) {
        error = createError(400, err.message);
      } else if (err.code === 11000) {
        const keys = Object.keys(err.keyValue);
        error = keys?.length
          ? createError(409, `${keys[0].toUpperCase()} is already registered`)
          : err;
      }

      next(error);
    });
  };
}
