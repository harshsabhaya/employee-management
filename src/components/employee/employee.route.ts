import express from 'express';
import validate from '../../middleware/validation';
import {
  companyIdSchema,
  empLoginSchema,
  employeeSchema,
  updateEmployeeSchema,
} from './employee.schema';
import { asyncErrorHandler } from '../../utils/error';
import { verifyAccessToken } from './../../utils/jwtHelper';
import {
  deleteEmployeeController,
  getEmployeeController,
  registerEmployeeController,
  employeeLoginController,
  updateEmployeeController,
  setCompanyIdController,
} from './employee.controller';

const router = express.Router();

// register employee
router.post(
  '/register',
  validate(employeeSchema),
  asyncErrorHandler(registerEmployeeController)
);

// employee Login
router.post(
  '/login',
  validate(empLoginSchema),
  asyncErrorHandler(employeeLoginController)
);

// get all employee list
router.get('/', verifyAccessToken, asyncErrorHandler(getEmployeeController));

// get Employee By Id
router.get(
  '/:employeeId',
  verifyAccessToken,
  asyncErrorHandler(getEmployeeController)
);

// Update employee with ID
router.put(
  '/:employeeId',
  verifyAccessToken,
  validate(updateEmployeeSchema),
  asyncErrorHandler(updateEmployeeController)
);

// Delete employee with ID
router.delete(
  '/:employeeId',
  verifyAccessToken,
  asyncErrorHandler(deleteEmployeeController)
);

// Set Company
router.patch(
  '/:employeeId',
  verifyAccessToken,
  validate(companyIdSchema),
  asyncErrorHandler(setCompanyIdController)
);

export default router;
