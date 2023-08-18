import JWT from 'jsonwebtoken';
import createError from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import client from '../helper/redis';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const verificationTokenSecret = process.env.VERIFICATION_TOKEN_SECRET;

export const signAccessToken = (user: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    const payload = {
      email: user.email,
      id: user.id,
    };

    const option = {
      expiresIn: '1h',
      issuer: 'abc.com',
      audience: user.id,
    };
    JWT.sign(payload, accessTokenSecret, option, (err: any, token: string) => {
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

    const option = {
      expiresIn: '1y', // 1 year expire time
      audience: user.id,
      issuer: 'abc.com',
    };

    JWT.sign(
      payload,
      refreshTokenSecret,
      option,
      async (err: any, token: string) => {
        if (err) {
          console.log('JWT refresh token error >', err);
          reject(createError.InternalServerError());
        }

        const result = await client.SET(user.id, token, {
          EX: 365 * 24 * 60 * 60, // 1 year
        });

        if (result === 'OK') {
          return resolve(token);
        }
        return reject(createError.InternalServerError());
      }
    );
  });
};

export const getVerificationToken = (user: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    const payload = {
      email: user.email,
      id: user.id,
    };

    const option = {
      expiresIn: '1h',
    };

    JWT.sign(
      payload,
      verificationTokenSecret,
      option,
      (err: any, token: string) => {
        if (err) {
          console.log('JWT verification token error >', err);
          reject(createError.InternalServerError());
        }
        resolve(token);
      }
    );
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
  JWT.verify(token, accessTokenSecret, (error: any, payload: any) => {
    if (error) {
      const message =
        error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
      next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

export const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      refreshTokenSecret,
      async (error: any, payload: any) => {
        if (error) return reject(createError.Unauthorized());
        const { id } = payload;

        const result = await client.GET(id);

        if (refreshToken === result) return resolve(payload);

        reject(createError.Unauthorized());
      }
    );
  });
};

export const verifyAccountVerificationToken = (token: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      token,
      verificationTokenSecret,
      async (error: any, payload: any) => {
        if (error)
          return reject(createError.Unauthorized('Invalid verification token'));

        return resolve(payload);
      }
    );
  });
};
