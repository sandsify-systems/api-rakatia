import { Router, Request, Response, NextFunction } from 'express';
import {
    signUpValidation,
    signInValidation,
    verifyValidation,
    resetPassword,
    updatePassword
} from '../../core/validation/auth.validation';
import { validateRequest } from '../../core/validation/index';
import UserController from './user.controller';
import User from '../../core/database/models/user/user.model';
import Company from '../../core/database/models/company/company.model';
import UserService from './user.service';
import resMsg from '../../core/utils/response';

const userService = new UserService(User, Company);
const userController = new UserController(userService, resMsg);

export const users = Router();

/**
 * Signup API route
 */
users.post(
    '/signup',
    signUpValidation,
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.signUp(req, res, next)
);

/**
 * Sigin API route
 */
users.post(
    '/signin',
    signInValidation,
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.signIn(req, res, next)
);

/**
 * Verify account API route
 */
users.post(
    '/verify',
    verifyValidation,
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.verifyAccount(req, res, next)
);

/**
 * Reset Password API route
 */
users.post(
    '/reset-password',
    resetPassword,
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.resetPassword(req, res, next)
);

/**
 * Update Password API route
 */
users.post(
    '/update-password',
    updatePassword,
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.updatePassword(req, res, next)
);

export default users;