import { Request, Response, NextFunction } from 'express';
import Employee from './employee.model';
import createError from 'http-errors';

import {
  getVerificationToken,
  signAccessToken,
  signRefreshToken,
  verifyAccountVerificationToken,
  verifyRefreshToken,
} from '../../utils/jwtHelper';
import sendMail from '../../utils/nodemailer';
import getTemplate from '../../helper/templateHandler';
import client from '../../helper/redis';

export const registerEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const employee = new Employee(req.body);
  const savedEmployee = await employee.save();

  const { firstName, lastName, email, id } = savedEmployee;

  const verificationToken = await getVerificationToken(savedEmployee);
  const verificationLink = `${process.env.API_HOST}api/employee/account-verify/${verificationToken}`;

  const emailPayload = {
    email,
    firstName: savedEmployee.firstName,
    url: verificationLink,
  };
  const template = getTemplate('register.html', emailPayload);

  const option = {
    subject: 'Hurrah! You have registered successfully',
    html: template,
  };

  const response = await sendMail([process.env.CLIENT_EMAIL], option);

  if (response.error) throw createError.InternalServerError();

  res.send({
    firstName,
    lastName,
    email,
    id,
  });
};

export const employeeLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user: any = await Employee.findOne({ email: email });
  if (!user) throw createError.NotFound('User does not found');

  const isMatch = await user.isValidPassword(password);
  if (!isMatch) throw createError.Unauthorized('Email/Password does not valid');

  if (!user.isVerified) {
    const verificationToken = await getVerificationToken(user);
    const verificationLink = `${process.env.API_HOST}api/employee/account-verify/${verificationToken}`;

    const emailPayload = {
      email,
      firstName: user.firstName,
      url: verificationLink,
    };

    const template = getTemplate('register.html', emailPayload);

    const option = {
      subject: 'Verify your account',
      html: template,
    };

    const response = await sendMail([process.env.CLIENT_EMAIL], option);

    // If mail does not send successfully
    if (response.error) throw createError.InternalServerError();

    // If mail sent successfully
    throw createError.Unauthorized(
      'Email is not verified, verification mail has been sent you.'
    );
  }

  const accessToken = await signAccessToken(user);
  const refreshToken = await signRefreshToken(user);
  const { firstName, lastName, id } = user;

  res.send({
    firstName,
    lastName,
    email,
    id,
    accessToken,
    refreshToken,
  });
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await verifyRefreshToken(req.body.refreshToken);
  const accessToken = await signAccessToken(user);
  const refreshToken = await signRefreshToken(user);
  res.send({ accessToken, refreshToken });
};

export const logoutEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: any = await verifyRefreshToken(req.body.refreshToken);
  await client.del(user.id);

  res.send(user);
};

export const accountVerifyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenPayload: any = await verifyAccountVerificationToken(
    req.params.verificationToken
  );

  const user = await Employee.findById(tokenPayload.id);

  if (!user) throw createError.NotFound('User is not registered');

  if (user.isVerified) return res.send('User is already verified');

  const updatedUser = await Employee.findByIdAndUpdate(tokenPayload.id, {
    isVerified: true,
  });

  if (!updatedUser) throw createError.InternalServerError();

  res.send('Employee verified successfully');
};

export const getEmployeeController = async (req: Request, res: Response) => {
  const employeeId = req.params.employeeId;
  const { search = '', designation }: any = req.query;

  console.log({ query: req.query });
  if (employeeId) {
    const employee = await Employee.findById(req.params.employeeId, {
      __v: 0,
      password: 0,
    }).populate('companyId');

    if (!employee) throw createError.NotFound();

    return res.send(employee);
  } else if (search || designation) {
    const query = {};
    if (search) query['$text'] = { $search: search };
    if (designation) query['designation'] = designation;

    const results = await Employee.find(query, { __v: 0, password: 0 });
    return res.send(results);
  }

  const employeeList = await Employee.find(
    {},
    { __v: 0, password: 0 }
  ).populate('companyId');
  res.send(employeeList);
};

export const updateEmployeeController = async (req: Request, res: Response) => {
  const updatedEmp = await Employee.findByIdAndUpdate(
    req.params.employeeId,
    req.body,
    { new: true, projection: { __v: 0, password: 0 } }
  );
  if (!updatedEmp)
    throw createError.BadRequest(
      'The Employee you are trying to update is not available '
    );
  res.send(updatedEmp);
};

export const deleteEmployeeController = async (req: Request, res: Response) => {
  const deletedEmp = await Employee.findByIdAndDelete(req.params.employeeId, {
    projection: { __v: 0, password: 0 },
  });
  if (!deletedEmp)
    throw createError.BadRequest(
      'The Employee you are trying to delete is not available'
    );

  res.send(deletedEmp);
};

export const setCompanyIdController = async (req: Request, res: Response) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.employeeId,
    {
      companyId: req.body.companyId,
    },
    { new: true, projection: { __v: 0 } }
  ).populate('companyId');
  if (!employee) throw createError.BadRequest('Employee does not exist');

  res.send(employee);
};
