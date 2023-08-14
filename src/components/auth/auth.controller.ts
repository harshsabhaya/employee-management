import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../../utils/error';
import createError from 'http-errors';
import User from './auth.model';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwtHelper';

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const isAlreadyExist = await User.findOne({ email: email });

  if (isAlreadyExist) throw createError.BadRequest('User already exist');

  const user = new User(req.body);
  const savedUser = await user.save();
  const accessToken = await signAccessToken(savedUser);
  const refreshToken = await signRefreshToken(savedUser);
  res.send({
    id: savedUser.id,
    email: savedUser.email,
    accessToken,
    refreshToken,
  });
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: any = await User.findOne({ email: req.body.email });
  if (!user) throw createError.NotFound('User not registered');

  const isMatch = await user.isValidPassword(req.body.password);
  if (!isMatch) throw createError.Unauthorized('Username/Password not valid');

  const accessToken = await signAccessToken(user);
  const refreshToken = await signRefreshToken(user);
  res.send({ id: user.id, email: user.email, accessToken, refreshToken });
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: any = await verifyRefreshToken(req.body.refreshToken);

  const accessToken = await signAccessToken(user);
  const refreshToken = await signRefreshToken(user);

  res.send({ id: user.id, email: user.email, accessToken, refreshToken });
};
