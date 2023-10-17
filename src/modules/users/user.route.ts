import { Router,Request, Response, NextFunction } from 'express';
import { signUpValidation } from '../../core/validation/auth.validation';
import { validateRequest } from '../../core/validation/index';
import UserController from './user.controller';
import User from '../../core/database/models/user/user.model';
import Role from '../../core/database/models/user/role.model';
import UserService from './user.service';
import resMsg from '../../core/utils/response';

const userService = new UserService(User, Role);
const userController = new UserController(userService, resMsg);

export const users = Router();

/**
 * Signup API route
 */
users.post(
    '/signup',
    signUpValidation,
    validateRequest,
    (req: Request, res: Response, next: NextFunction)=>userController.signUp(req, res, next)
);

export default users;
