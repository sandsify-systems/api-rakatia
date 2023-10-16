import { Router } from 'express';
import { signUpValidation } from '../../core/validation/auth.validation';
import { validateRequest } from '../../core/validation/index';
import UserController from './user.controller';

const userController = new UserController();

export const users = Router();

/**
 * Signup API route
 */
users.post('/signup', signUpValidation, validateRequest, userController.signUp);

export default users;
