import Joi from 'joi';

const addressSchema = Joi.object().keys({
  line1: Joi.string().required(),
  line2: Joi.string().allow(''),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  zipCode: Joi.number().required(),
});

export const companySchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  address: addressSchema,
  contact: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
});

export const statusSchema = Joi.object().keys({
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
});
