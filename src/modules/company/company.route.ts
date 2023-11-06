import { Router, Request, Response, NextFunction } from 'express';
import {
    createCompanyValidation,
    sendInvitationValidation,
    acceptInvitationValidation
} from '../../core/validation/company.validation';
import { validateRequest } from '../../core/validation/index';
import CompanyController from './company.controller';
import CompanyService from './company.service';
import User from '../../core/database/models/user/user.model';
import Company from '../../core/database/models/company/company.model';
import Invitations from '../../core/database/models/invitations/invitations.model';
import resMsg from '../../core/utils/response';
import { authoriseRequest, CustomRequest } from '../../core/utils/authorizationMiddleWare';

const companyService = new CompanyService(User, Company, Invitations);
const companyController = new CompanyController(companyService, resMsg);

export const company = Router();

/**
 * Company signup API route
 */
company.post(
    '/create',
    authoriseRequest,
    createCompanyValidation,
    validateRequest,
    (req: CustomRequest, res: Response, next: NextFunction) => companyController.createCompany(req, res, next)
);

/**
 * Company send invitation API route
 */
company.post(
    '/send-invitation',
    authoriseRequest,
    sendInvitationValidation,
    validateRequest,
    (req: CustomRequest, res: Response, next: NextFunction) => companyController.sendInvitation(req, res, next)
);

/**
 * Company accept invitation API route
 */
company.post(
    '/accept-invitation',
    acceptInvitationValidation,
    validateRequest,
    (req: CustomRequest, res: Response, next: NextFunction) => companyController.acceptInvitation(req, res, next)
);
export default company;