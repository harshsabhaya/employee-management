import Joi from 'joi';

export const LoginPayload = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

export const RefreshToken = Joi.object().keys({
  refreshToken: Joi.string().required(),
});
