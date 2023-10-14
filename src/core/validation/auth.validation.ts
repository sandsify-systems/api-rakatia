import { check } from 'express-validator';

export const signUpValidation = [
	check('firstName').isString().notEmpty().withMessage('firstName is required'),
	check('lastName').isString().notEmpty().withMessage('lastName is required'),
	check('email')
		.isEmail()
		.withMessage('email is not a valid email')
		.notEmpty()
		.withMessage('email is required'),
	check('password')
	.isString()
	.notEmpty()
	.isLength({min:8})
	.withMessage('password is required and minimum of 8 characters'),
	check('phoneNumber').isString().withMessage('phoneNumber is required'),
];
