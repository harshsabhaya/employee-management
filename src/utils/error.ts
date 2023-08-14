// Only wrap async function with this function
import { NextFunction, Request, Response } from 'express';
// import mongoose from 'mongoose';
const mongoose = require('mongoose');
import createError from 'http-errors';

export function asyncErrorHandler(func: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err: any) => {
      if (err instanceof mongoose.CastError) {
        next(createError(400, err.message));
        return;
      }
      next(err);
    });
  };
}
