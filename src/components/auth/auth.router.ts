import express, { NextFunction, Request, Response } from 'express';
import validate from '../../middleware/validation';
import { LoginPayload, RefreshToken } from './auth.schema';
import {
  registerUserController,
  loginController,
  refreshTokenController,
} from './auth.controller';
import { asyncErrorHandler } from '../../utils/error';

const router = express.Router();

router.post(
  '/register',
  validate(LoginPayload),
  asyncErrorHandler(registerUserController)
);

router.post(
  '/refresh-token',
  validate(RefreshToken),
  asyncErrorHandler(refreshTokenController),
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('Refresh Token');
  }
);

router.post(
  '/login',
  validate(LoginPayload),
  asyncErrorHandler(loginController)
);

router.delete(
  '/logout',
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('LogOut');
  }
);

export default router;
