import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../../utils/error';
import createError from 'http-errors';
import User from './auth.model';
import client from './../../helper/redis';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwtHelper';
import sendMail from '../../utils/nodemailer';

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
  if (!isMatch)
    throw createError.Unauthorized('Username/Password does not valid');

  const accessToken = await signAccessToken(user);
  const refreshToken = await signRefreshToken(user);
  const mail = process.env.CLIENT_EMAIL;

  const option = {
    subject: 'Login Successfully',
    text: `Thank you for login with ${mail}`,
    html: `<h1>Thank you for login with ${mail}</h1>`,
  };

  sendMail(mail, option);

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

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: any = await verifyRefreshToken(req.body.refreshToken);
  await client.del(user.id);
  res.sendStatus(204);
};
