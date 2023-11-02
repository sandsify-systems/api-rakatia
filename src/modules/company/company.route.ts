import { Router, Request, Response, NextFunction } from 'express';
import {
    companySignUpValidation
} from '../../core/validation/company.validation';
import { validateRequest } from '../../core/validation/index';
import CompanyController from './company.controller';
import CompanyService from './company.service';
import User from '../../core/database/models/user/user.model';
import Company from '../../core/database/models/company/company.model';
import resMsg from '../../core/utils/response';

const companyService = new CompanyService(User, Company);
const companyController = new CompanyController(companyService, resMsg);

export const company = Router();

/**
 * Company signup API route
 */
company.post(
    '/signup',
    companySignUpValidation,
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => companyController.createCompany(req, res, next)
);

export default company;