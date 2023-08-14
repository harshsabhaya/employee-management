import JWT from 'jsonwebtoken';
import createError from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import client from '../helper/redis';

export const signAccessToken = (user: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    const payload = {
      email: user.email,
      id: user.id,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const option = {
      expiresIn: '15s',
      issuer: 'abc.com',
      audience: user.id,
    };
    JWT.sign(payload, secret, option, (err: any, token: string) => {
      if (err) {
        console.log('JWT access token error >', err);
        reject(createError.InternalServerError());
      }
      return resolve(token);
    });
  });
};

export const signRefreshToken = (user: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    const payload = {
      email: user.email,
      id: user.id,
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const option = {
      expiresIn: '1y', // 1 year expire time
      audience: user.id,
      issuer: 'abc.com',
    };

    JWT.sign(payload, secret, option, (err: any, token: string) => {
      if (err) {
        console.log('JWT refresh token error >', err);
        reject(createError.InternalServerError());
      }
      return resolve(token);
    });
  });
};

export const verifyAccessToken = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) throw createError.Unauthorized();
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];
  JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (error: any, payload: any) => {
      if (error) {
        const message =
          error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
        next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    }
  );
};

export const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error: any, payload: any) => {
        if (error) return reject(createError.Unauthorized());
        resolve(payload);
      }
    );
  });
};
