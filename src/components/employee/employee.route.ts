import express from 'express';
import multer from 'multer';
import path from 'path';
import validate from '../../middleware/validation';
import {
  companyIdSchema,
  empLoginSchema,
  employeeSchema,
  refreshTokenSchema,
  updateEmployeeSchema,
} from './employee.schema';
import { asyncErrorHandler } from '../../utils/error';
import { verifyAccessToken } from './../../utils/jwtHelper';
import {
  deleteEmployeeController,
  getEmployeeController,
  registerEmployeeController,
  employeeLoginController,
  refreshTokenController,
  updateEmployeeController,
  setCompanyIdController,
  logoutEmployeeController,
  accountVerifyController,
} from './employee.controller';

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, 'profile'),
  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const upload: any = multer({ storage });

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

// Refresh Token
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  asyncErrorHandler(refreshTokenController)
);

// logout employee
router.delete(
  '/logout',
  verifyAccessToken,
  validate(refreshTokenSchema),
  asyncErrorHandler(logoutEmployeeController)
);

// Account Verification
router.get(
  '/account-verify/:verificationToken',
  asyncErrorHandler(accountVerifyController)
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
  upload.single('profile'),
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
