import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

import Company from './company.model';
import sendMail from '../../utils/nodemailer';

export const addCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const company = new Company(req.body);
  const savedCompany = await company.save();

  const option = {
    subject: 'Hurrah! your company has been registered successfully',
    text: `Your company, ${savedCompany.name}, has been registered with ${savedCompany.email}`,
  };

  sendMail('harshsabhaya99@gmail.com', option);

  res.send(savedCompany);
};

export const getCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const companyId = req.params.companyId;
  if (companyId) {
    const company = await Company.findById(companyId, { __v: 0 });
    if (!company) throw createError.NotFound('Company does not found');

    res.send(company);
    return;
  }
  const list = await Company.find({}, { __v: 0 });
  res.send(list);
};

export const updateCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const company = await Company.findByIdAndUpdate(
    req.params.companyId,
    req.body,
    {
      new: true,
      projection: { __v: 0 },
    }
  );
  if (!company)
    throw createError.BadRequest(
      'Company that you are trying to update is not available'
    );

  res.send(company);
};

export const deleteCompanyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const company = await Company.findByIdAndDelete(req.params.companyId, {
    projection: { __v: 0 },
  });
  if (!company)
    throw createError.BadRequest(
      'Company that you are trying to remove is not available'
    );

  res.send(company);
};
