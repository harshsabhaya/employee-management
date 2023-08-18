import Joi from 'joi';

export const employeeSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  designation: Joi.string()
    .valid('MANAGER', 'TEAM_LEADER', 'DEVELOPER')
    .required(),
  companyId: Joi.string().allow(''),
});

export const updateEmployeeSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  designation: Joi.string()
    .valid('MANAGER', 'TEAM_LEADER', 'DEVELOPER')
    .required(),
  companyId: Joi.string().allow(''),
});

export const companyIdSchema = Joi.object().keys({
  companyId: Joi.string().required(),
});

export const empLoginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});
