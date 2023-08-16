import express from 'express';
import { asyncErrorHandler } from '../../utils/error';
import {
  addCompanyController,
  deleteCompanyController,
  getCompanyController,
  updateCompanyController,
} from './company.controller';
import { verifyAccessToken } from './../../utils/jwtHelper';
import validate from './../../middleware/validation';
import { companySchema, statusSchema } from './company.schema';

const router = express.Router();

// Add company name
router.post(
  '/',
  verifyAccessToken,
  validate(companySchema),
  asyncErrorHandler(addCompanyController)
);

// Get All companies
router.get('/', verifyAccessToken, asyncErrorHandler(getCompanyController));

// Update Company with ID
router.put(
  '/:companyId',
  verifyAccessToken,
  validate(companySchema),
  asyncErrorHandler(updateCompanyController)
);

// Get Company with specific Id
router.get(
  '/:companyId',
  verifyAccessToken,
  asyncErrorHandler(getCompanyController)
);

router.delete(
  '/:companyId',
  verifyAccessToken,
  asyncErrorHandler(deleteCompanyController)
);

// Update Company status
router.patch(
  '/:companyId',
  verifyAccessToken,
  validate(statusSchema),
  asyncErrorHandler(updateCompanyController)
);

export default router;
