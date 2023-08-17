import { Request, Response, NextFunction } from 'express';
import Employee from './employee.model';
import { signAccessToken, signRefreshToken } from '../../utils/jwtHelper';
import createError from 'http-errors';
import sendMail from '../../utils/nodemailer';
import getTemplate from '../../helper/templateHanlder';

export const registerEmployeeController = async (
  req: Request,
  res: Response
) => {
  const employee = new Employee(req.body);
  const savedEmployee = await employee.save();

  const accessToken = await signAccessToken(savedEmployee);
  const refreshToken = await signRefreshToken(savedEmployee);
  const { firstName, lastName, email, id } = savedEmployee;

  const emailPayload = {
    email,
    firstName: savedEmployee.firstName,
  };
  const template = getTemplate('register.html', emailPayload);

  const option = {
    subject: 'Hurrah! You have registered successfully',
    html: template,
  };

  sendMail([process.env.CLIENT_EMAIL], option);

  res.send({
    firstName,
    lastName,
    email,
    id,
    accessToken,
    refreshToken,
  });
};

export const employeeLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: any = await Employee.findOne({ email: email });
  if (!user) throw createError.NotFound('User does not found');

  const isMatch = await user.isValidPassword(password);
  if (!isMatch) throw createError.Unauthorized('Email/Password does not valid');

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

export const getEmployeeController = async (req: Request, res: Response) => {
  const employeeId = req.params.employeeId;
  if (employeeId) {
    const employee = await Employee.findById(req.params.employeeId, {
      __v: 0,
      password: 0,
    }).populate('companyId');

    if (!employee) throw createError.NotFound();

    return res.send(employee);
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
