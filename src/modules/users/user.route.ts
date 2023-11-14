import { Router, Request, Response, NextFunction } from 'express';
import {
    signUpValidation,
    signInValidation,
    verifyValidation,
    resetPassword,
    updatePassword,
    getUser,
    updateUserValidation
} from '../../core/validation/users.validation';
import { validateRequest } from '../../core/validation/index';
import UserController from './user.controller';
import User from '../../core/database/models/user/user.model';
import Company from '../../core/database/models/company/company.model';
import UserService from './user.service';
import resMsg from '../../core/utils/response';
import { authoriseRequest, CustomRequest } from '../../core/utils/authorizationMiddleWare';


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

/**
 * Get user API route
 */
users.get(
    '/',
    authoriseRequest,
    getUser,
    validateRequest,
    (req: CustomRequest, res: Response, next: NextFunction) => userController.getUser(req, res, next)
);

/**
 * Update user API route
 */
users.put(
    '/update',
    authoriseRequest,
    updateUserValidation,
    validateRequest,
    (req: CustomRequest, res: Response, next: NextFunction) => userController.updateUser(req, res, next)
);

export default users;